let exchangeRate = {}

const setExchangeRate = newExchangeRate => {
  try {
    if (!newExchangeRate.conversion_rates) {
      throw new TypeError('O novo objeto precisa ter uma prop "conversion_rates"')
    }

    exchangeRate = newExchangeRate
    return exchangeRate
  } catch ({ name, message }) {
    renderErrorAlert(name, message)
  }
}

const getExchangeRate = () => exchangeRate

const getErrorMessage = errorCode => {
  const errorCodes = {
    403: 'Acesso negado. Não autorizado.',
    404: 'Servidor não encontrou o recurso requisitado.',
    "invalid-key": 'Chave da API inválida.',
    "inactive-account": 'Endereço de email não confirmado.',
    "quota-reached": 'Limite de pesquisas diárias atingido.'
  }

  return errorCodes[errorCode] || 'Erro desconhecido.'
}

const closeAlert = e => {
  const errorType = e.target.dataset.target
  document.querySelector(`[data-error="${errorType}"]`).remove()
}

const getAlertContainer = (errorType, alertMessage) => {
  const alertContainer = document.createElement('div')
  alertContainer.setAttribute('class', 'alert alert-danger max-w-fit m-inline d-flex align-items-center')
  alertContainer.setAttribute('data-error', errorType)

  const iconDanger = document.createElement('i')
  iconDanger.setAttribute('class', 'bi bi-exclamation-diamond position-absolute fs-1-8r left-two')

  const alertDetails = document.createElement('div')
  alertDetails.classList.add('p-inline-2r')
  alertDetails.textContent = `${errorType}: ${alertMessage}`

  const iconClose = document.createElement('i')
  iconClose.setAttribute('class', 'bi bi-x fs-2-7r position-absolute right-half-one')
  iconClose.setAttribute('data-target', errorType)
  iconClose.addEventListener('click', closeAlert)

  alertContainer.append(iconDanger, alertDetails, iconClose)
  return alertContainer
}

const renderErrorAlert = (errorType, alertMessage) => {
  const titleContainer = document.querySelector('[data-js="title"')
  const alertContainer = getAlertContainer(errorType, alertMessage)

  titleContainer.insertAdjacentElement('afterend', alertContainer)
}

const fetchExchangeRate = async url => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(response.status)
    }

    const exchangeRate = await response.json()

    return setExchangeRate(exchangeRate)
  } catch ({ name, message }) {
    const errorMessage = getErrorMessage(message)
    renderErrorAlert(`Error ${name}`, errorMessage)
  }
}

export { fetchExchangeRate, getExchangeRate }