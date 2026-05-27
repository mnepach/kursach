const CURRENCY_CONFIG = {
  BY: { code: 'BYN', symbol: 'Br', name: 'белорусских рублях', locale: 'be-BY' },
  RU: { code: 'RUB', symbol: '₽', name: 'российских рублях', locale: 'ru-RU' },
  DEFAULT: { code: 'EUR', symbol: '€', name: 'евро', locale: 'de-DE' }
};

const BASE_PRICES_EUR = {
  basic: 5.49,
  premium: 9.89
};

const EXCHANGE_RATES_FALLBACK = {
  RUB: 100,
  BYN: 3.6
};

async function getExchangeRates() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR', {
      signal: AbortSignal.timeout(3000)
    });
    const data = await response.json();
    return data.rates || EXCHANGE_RATES_FALLBACK;
  } catch {
    return EXCHANGE_RATES_FALLBACK;
  }
}

async function detectCountry() {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000)
    });
    const data = await response.json();
    return data.country_code || 'EU';
  } catch {
    return 'EU';
  }
}

async function getPricingForCountry() {
  const [country, rates] = await Promise.all([detectCountry(), getExchangeRates()]);

  let currency;
  if (country === 'BY') {
    currency = CURRENCY_CONFIG.BY;
  } else if (country === 'RU') {
    currency = CURRENCY_CONFIG.RU;
  } else {
    currency = CURRENCY_CONFIG.DEFAULT;
  }

  const formatPrice = (eurPrice) => {
    if (currency.code === 'EUR') {
      return { amount: eurPrice, display: `${eurPrice} €` };
    }
    const rate = rates[currency.code] || EXCHANGE_RATES_FALLBACK[currency.code] || 1;
    const converted = Math.round(eurPrice * rate);
    const rounded = currency.code === 'BYN'
      ? Math.round(converted / 0.5) * 0.5
      : Math.round(converted / 10) * 10;
    return {
      amount: rounded,
      display: `${rounded} ${currency.symbol}`
    };
  };

  return {
    country,
    currency,
    prices: {
      basic: formatPrice(BASE_PRICES_EUR.basic),
      premium: formatPrice(BASE_PRICES_EUR.premium)
    }
  };
}

window._pricingCache = null;
window._pricingPromise = null;

async function getCachedPricing() {
  if (window._pricingCache) return window._pricingCache;
  if (window._pricingPromise) return window._pricingPromise;
  window._pricingPromise = getPricingForCountry().then(result => {
    window._pricingCache = result;
    window._pricingPromise = null;
    return result;
  });
  return window._pricingPromise;
}

window.getCachedPricing = getCachedPricing;