
const apiKey = '' // Copy your api key here
export function getExchangeRate(baseCurrency, targetCurrency) {
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${baseCurrency}/${targetCurrency}`

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`)
      }
      return response.json();
    })
    .then(data => {
      if (data.result === 'success') {
        return data.conversion_rate
      } else {
        throw new Error('Data error: ' + data.error)
      }
    });
}