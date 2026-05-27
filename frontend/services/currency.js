const CURRENCY_CONFIG = {
  BY: { code: 'BYN', symbol: 'Br', name: 'белорусских рублях', locale: 'be-BY', fixedPrices: { basic: 9.99, premium: 17.99 } },
  RU: { code: 'RUB', symbol: '₽', name: 'российских рублях', locale: 'ru-RU' },
  DEFAULT: { code: 'EUR', symbol: '€', name: 'евро', locale: 'de-DE' }
};

const EXCHANGE_RATES_FALLBACK = {
  RUB: 25.84,
  BYN: 1,
  EUR: 0.3125
};

async function getExchangeRates(baseCurrency = 'EUR') {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`, {
      signal: AbortSignal.timeout(3000)
    });
    const data = await response.json();
    return data.rates || null;
  } catch {
    return null;
  }
}

async function getBynToTargetRate(targetCurrency, fallbackRates = null) {
  if (targetCurrency === 'BYN') return 1;

  try {
    const eurRates = await getExchangeRates('EUR');
    if (eurRates && eurRates.BYN && eurRates[targetCurrency]) {
      const bynToEur = 1 / eurRates.BYN;
      const eurToTarget = eurRates[targetCurrency];
      return bynToEur * eurToTarget;
    }
  } catch (e) {}

  if (fallbackRates && fallbackRates[targetCurrency]) {
    return fallbackRates[targetCurrency];
  }

  const fallbacks = {
    RUB: 25.84,
    EUR: 0.3125,
    USD: 0.34
  };
  return fallbacks[targetCurrency] || 1;
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

function roundPrice(amount, currencyCode) {
  if (currencyCode === 'BYN') {
    return Math.round(amount * 100) / 100;
  }
  if (currencyCode === 'RUB') {
    return Math.round(amount / 10) * 10;
  }
  return Math.round(amount * 100) / 100;
}

async function getPricingForCountry() {
  const country = await detectCountry();

  let currency;
  let isFixedBelarus = false;

  if (country === 'BY') {
    currency = CURRENCY_CONFIG.BY;
    isFixedBelarus = true;
  } else if (country === 'RU') {
    currency = CURRENCY_CONFIG.RU;
  } else {
    currency = CURRENCY_CONFIG.DEFAULT;
  }

  const formatPrice = async (bynPrice) => {
    if (isFixedBelarus) {
      const fixedBasic = CURRENCY_CONFIG.BY.fixedPrices.basic;
      const fixedPremium = CURRENCY_CONFIG.BY.fixedPrices.premium;
      return {
        basic: {
          amount: fixedBasic,
          display: `${fixedBasic.toFixed(2)} ${CURRENCY_CONFIG.BY.symbol}`
        },
        premium: {
          amount: fixedPremium,
          display: `${fixedPremium.toFixed(2)} ${CURRENCY_CONFIG.BY.symbol}`
        }
      };
    }

    const rate = await getBynToTargetRate(currency.code, EXCHANGE_RATES_FALLBACK);
    const convertPrice = (priceInByn) => {
      const converted = priceInByn * rate;
      const rounded = roundPrice(converted, currency.code);
      return {
        amount: rounded,
        display: currency.code === 'EUR' ? `${rounded} €` : `${rounded} ${currency.symbol}`
      };
    };

    return {
      basic: convertPrice(9.99),
      premium: convertPrice(17.99)
    };
  };

  const prices = await formatPrice();

  return {
    country,
    currency: {
      code: currency.code,
      symbol: currency.symbol,
      name: currency.name,
      locale: currency.locale
    },
    prices
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