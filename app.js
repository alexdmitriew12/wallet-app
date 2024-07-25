import { Wallet } from './wallet.js'
import { getExchangeRate } from './currencyApi.js'


let money = 0
document.getElementById("account").textContent = money
document.getElementById("history").textContent = ''
const myWallet = new Wallet(money)

document.addEventListener('DOMContentLoaded', () => {
    myWallet.historyDisplay
    myWallet.updateDisplay()

})

const addMoney = () => {
    let amount = parseFloat(document.getElementById("amount").value)
    let roundedAmount = Number(amount.toFixed(2))
    let description = document.getElementById("description").value
    let category = document.getElementById("category").value
    if(!isNaN(roundedAmount) && description != "" && category != "" && roundedAmount > 0) {
        myWallet.addMoney(roundedAmount, description, category)
        notification(add, `Added ${roundedAmount}$`)

    }
    else if(roundedAmount < 0) {
        notification(remove, `Amount cannot be less than 0`)

    }
    else {
        notification(remove, `Write a description, fill a amount or select category`)
    }
}


const removeMoney = () => {
    let amount = parseFloat(document.getElementById("amount").value)
    let roundedAmount = Number(amount.toFixed(2))
    let description = document.getElementById("description").value
    let category = document.getElementById("category").value
    if(!isNaN(roundedAmount) && myWallet.money >= roundedAmount && description != "" && category != ""  && roundedAmount > 0) {
        myWallet.removeMoney(roundedAmount, description, category)
        notification(remove, `Removed ${roundedAmount}$`)
    }
    else if(roundedAmount < 0) {
        notification(remove, `Amount cannot be less than 0`)

    }
    else {
        notification(remove, `Write a description, fill a amount or select category`)
    }
}

const notification = (type, message) => {
    const container = document.getElementById("container")
    const existingNotify = container.querySelector(".notify")
    if (existingNotify) {
        container.removeChild(existingNotify)
    }
    let notify = document.createElement("div")
    notify.className = "notify"

    if (type === remove) {
        notify.classList.add("negative")
    } else if (type === add) {
        notify.classList.add("positive")
    } else {
        notify.classList.add("negative")
        message = "Unknown Error"
    }

    const notifySound = document.getElementById("notificationSound")
    notifySound.volume = 0.2
    notifySound.play()

    let textNode = document.createTextNode(message)
    notify.appendChild(textNode)
    container.appendChild(notify)
    setTimeout(() => {
        if (container.contains(notify)) {
            container.removeChild(notify)
        }
    }, 4000)
}


document.getElementById('exportButton').addEventListener('click', function() {
    toggleExportDialog(true)
})
document.getElementById('statsButton').addEventListener('click', function() {
    toggleStatsDialog(true)
})

document.getElementById('kantorButton').addEventListener('click', function() {
    toggleKantorDialog(true)
})

const toggleStatsDialog = (show) => {
    console.log("ok")
    document.getElementById('statsMenu').style.display = show ? 'flex' : 'none'
}

const updateExchangeRates = (currencyPairs) => {
    const exchangeRateDisplay = document.getElementById('exchangeRateDisplay')
    exchangeRateDisplay.textContent = ''
  
    currencyPairs.forEach(pair => {
      const [baseCurrency, targetCurrency] = pair.split('-')
      getExchangeRate(baseCurrency, targetCurrency)
        .then(rate => {
          const rateLine = document.createElement('div')
          rateLine.textContent = `1 ${baseCurrency} = ${rate} ${targetCurrency}`
          exchangeRateDisplay.appendChild(rateLine)
        })
    })
}

  const toggleKantorDialog = (show) => {
    document.getElementById('kantorMenu').style.display = show ? 'flex' : 'none';
    if (show) {
      const currencyPairs = ['USD-EUR', 'USD-GBP', 'USD-JPY'];
      updateExchangeRates(currencyPairs);
    }
  }

const toggleExportDialog = (show) => {
    document.getElementById('exportDialog').style.display = show ? 'flex' : 'none'
    document.getElementById("export-csv").addEventListener("click", () => myWallet.exportToCSV("csv"))
    document.getElementById("export-txt").addEventListener("click", () => myWallet.exportToCSV("txt"))
}




document.getElementById("add").addEventListener("click", addMoney)
document.getElementById("remove").addEventListener("click", removeMoney)


document.getElementById("sort-amount").addEventListener("click", () => myWallet.sortAmount())
document.getElementById("sort-category").addEventListener("click", () => myWallet.sortCategory())
document.getElementById("sort-date").addEventListener("click", () => myWallet.sortDate())
document.getElementById("close-export").addEventListener("click", () => toggleExportDialog(false))
document.getElementById("close-stats").addEventListener("click", () => toggleStatsDialog(false))
document.getElementById("close-kantor").addEventListener("click", () => toggleKantorDialog(false))

document.getElementById("kantorApply").addEventListener("click", () => {
    let amount = parseFloat(document.getElementById("kantor-amount").value)
    let baseCurrency = document.getElementById("base-currency").value
    let targetCurrency = document.getElementById("target-currency").value

    if (!isNaN(amount) && amount > 0 && baseCurrency && targetCurrency && amount <= myWallet.money) {
        myWallet.removeMoney(amount, "Cantor", "Currency exchange")
        myWallet.convertCurrency(amount, baseCurrency, targetCurrency)
        notification(add, `Added ${amount}$ ${targetCurrency}`)
    } else {
        notification(remove, "Ensure all fields are filled correctly")
    }
})







