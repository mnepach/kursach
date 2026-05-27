import axios from 'axios';

const CURRENCY_CONFIG = {
  BY: { code: 'BYN', symbol: 'Br', name: 'белорусских рублях', fixedPrices: { basic: 9.99, premium: 17.99 } },
  RU: { code: 'RUB', symbol: '₽', name: 'российских рублях' },
  DEFAULT: { code: 'EUR', symbol: '€', name: 'евро' },
};

const EXCHANGE_RATES_FALLBACK = {
  RUB: 25.84,
  EUR: 0.3125,
};

async function detectCountry() {
  try {
    const response = await axios.get('https://ipapi.co/json/', { timeout: 3000 });
    return response.data.country_code || 'EU';
  } catch {
    return 'EU';
  }
}

async function getExchangeRates() {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR', { timeout: 3000 });
    return response.data.rates || null;
  } catch {
    return null;
  }
}

function roundPrice(amount, currencyCode) {
  if (currencyCode === 'BYN') return Math.round(amount * 100) / 100;
  if (currencyCode === 'RUB') return Math.round(amount / 10) * 10;
  return Math.round(amount * 100) / 100;
}

async function getBynToTargetRate(targetCurrency) {
  if (targetCurrency === 'BYN') return 1;
  try {
    const rates = await getExchangeRates();
    if (rates && rates.BYN && rates[targetCurrency]) {
      return (1 / rates.BYN) * rates[targetCurrency];
    }
  } catch {}
  return EXCHANGE_RATES_FALLBACK[targetCurrency] || 1;
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

  let prices;

  if (isFixedBelarus) {
    prices = {
      basic: { amount: CURRENCY_CONFIG.BY.fixedPrices.basic },
      premium: { amount: CURRENCY_CONFIG.BY.fixedPrices.premium },
    };
  } else {
    const rate = await getBynToTargetRate(currency.code);
    prices = {
      basic: { amount: roundPrice(9.99 * rate, currency.code) },
      premium: { amount: roundPrice(17.99 * rate, currency.code) },
    };
  }

  return {
    country,
    currency: {
      code: currency.code,
      symbol: currency.symbol,
      name: currency.name,
    },
    prices,
  };
}

let _cache = null;
let _promise = null;

export async function getCachedPricing() {
  if (_cache) return _cache;
  if (_promise) return _promise;
  _promise = getPricingForCountry().then(result => {
    _cache = result;
    _promise = null;
    return result;
  });
  return _promise;
}