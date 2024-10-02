import { fetchExchangeRate, getExchangeRate } from './exchangeRate.js'

const currencyOneEl = document.querySelector('[data-js="currency-one"]')
const currencyTwoEl = document.querySelector('[data-js="currency-two"]')
const timesCurrencyOneEl = document.querySelector('[data-js="times-currency-one"]')
const APIKey = '588d19b9f69977770a6c51e2'
const baseURL = 'https://v6.exchangerate-api.com/v6/'

const getCurrencyURL = currency => `${baseURL}${APIKey}/latest/${currency}`

const getOptions = (currencies, desiredCurrency) => {
  const setDesiredCurrency = currency =>
    currency === desiredCurrency ? ' selected ' : ''
  const stringifyArray = (acc, currency) =>
    `${acc}<option${setDesiredCurrency(currency)}>${currency}</option>`

  return Object.keys(currencies).reduce(stringifyArray, ``)
}

const getNotRoundedCurrencyValue = currencyPrecision =>
  `1 ${currencyOneEl.value} = ${currencyPrecision} ${currencyTwoEl.value}`

const getMultipliedCurrencyValue = value =>
  (value * timesCurrencyOneEl.value).toFixed(2)

const showUpdatedRates = currencies => {
  const currencyPrecisionEl = document.querySelector('[data-js="currency-precision"]')
  const convertedValueEl = document.querySelector('[data-js="converted-value"]')
  const currencyValue = currencies[currencyTwoEl.value]
  const currencyPrecision = currencies[currencyTwoEl.value]

  convertedValueEl.textContent = getMultipliedCurrencyValue(currencyValue)
  currencyPrecisionEl.textContent = getNotRoundedCurrencyValue(currencyPrecision)
}

const handleCurrencyOneEl = async () => {
  const desiredCurrency = getCurrencyURL(currencyOneEl.value)
  const { conversion_rates } = await fetchExchangeRate(desiredCurrency)

  showUpdatedRates(conversion_rates)
}

const handleCurrencyTwoEl = () => {
  const { conversion_rates } = getExchangeRate()
  showUpdatedRates(conversion_rates)
}

const handleTimesCurrencyOneEl = () => {
  const convertedValueEl = document.querySelector('[data-js="converted-value"]')
  const { conversion_rates } = getExchangeRate()
  const currencyValue = conversion_rates[currencyTwoEl.value]

  convertedValueEl.textContent = `${getMultipliedCurrencyValue(currencyValue)}`
}

const showInitialInfo = currencies => {
  currencyOneEl.innerHTML = getOptions(currencies, 'USD')
  currencyTwoEl.innerHTML = getOptions(currencies, 'BRL')

  showUpdatedRates(currencies)
}

const init = async () => {
  const currencyURL = getCurrencyURL('USD')
  const { conversion_rates } = await fetchExchangeRate(currencyURL)
  const exchangeRate = getExchangeRate()

  if (exchangeRate && exchangeRate.conversion_rates) {
    showInitialInfo(conversion_rates)
  }

  return
}

currencyOneEl.addEventListener('input', handleCurrencyOneEl)
currencyTwoEl.addEventListener('input', handleCurrencyTwoEl)
timesCurrencyOneEl.addEventListener('input', handleTimesCurrencyOneEl)

init()