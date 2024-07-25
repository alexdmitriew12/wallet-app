import { getExchangeRate } from './currencyApi.js'
import { setCookie } from './cookies.js'
import { getCookie } from './cookies.js'

export class Wallet {
    constructor(money) {
        const savedState = getCookie('walletState');
        if (savedState) {
            this.money = savedState.money
            this.history = savedState.history
            this.currencies = savedState.currencies
        } else {
            this.money = money;
            this.history = []
            this.currencies = {
                USD: this.money,
                EUR: 0,
                GBP: 0,
                JPY: 0
            }
        }
    }
    addMoney(amount, description, category, date = new Date()) {
        amount = parseFloat(amount)
        this.money += Number(amount.toFixed(2))
        this.updateDisplay()
        this.updateHistory(`<i class="material-icons icon">add</i>${amount}$`,`Description: ${description}`,`Type: `, category,`Date: ${date.toLocaleString('pl-PL')}`)
        this.statistics(amount, "add")
        this.currencies.USD += Number(amount.toFixed(2))
        setCookie('walletState', {money: this.money, history: this.history, currencies: this.currencies}, 365)

    }
    removeMoney(amount, description, category, date = new Date()){
        amount = parseFloat(amount)
        this.money -= Number(amount.toFixed(2))
        this.updateDisplay()
        this.updateHistory(`<i class="material-icons icon">remove</i>${amount}$`,`Description: ${description}`,`Type: `, category,`Date: ${date.toLocaleString('pl-PL')}`)
        this.statistics(amount, "remove")
        this.currencies.USD += Number(amount.toFixed(2))
        setCookie('walletState', {money: this.money, history: this.history, currencies: this.currencies}, 365)


    }
    updateDisplay() {
        document.getElementById("account").textContent = `$${this.money}`
        document.getElementById("account-eur").textContent = `€${this.currencies.EUR}`
        document.getElementById("account-gbp").textContent = `£${this.currencies.GBP}`
        document.getElementById("account-jpy").textContent = `¥${this.currencies.JPY}`
        this.updateWalletIcon()
    }
    updateHistory(amount, action, description, category, date) {
        this.history.push({amount,action,description,category,date
        })
        this.historyDisplay()
    }
    historyDisplay(sortedHistory = this.history) {
        const historyElement = document.getElementById("history")
        historyElement.innerHTML = '<ul class="collection"></ul>'
        const ul = historyElement.querySelector('.collection')
        sortedHistory.forEach(element => {
            let listItem = document.createElement("li")
            listItem.innerHTML = `${element.amount}, ${element.action}, ${element.description} ${element.category}, ${element.date}`
            listItem.className = 'collection-item'
            ul.appendChild(listItem)
        })
    }
    statistics(amount, type) {
        const addStats = document.getElementById("stats-add")
        const removeStats = document.getElementById("stats-remove")
        if (!this.addedCash) {
            this.addedCash = 0
        }
        if (!this.removedCash) {
            this.removedCash = 0
        }
        if (type === "add") {
            this.addedCash += amount
            addStats.innerHTML = `Total earned money ${this.addedCash.toFixed(2)}`
        } else if (type === "remove") {
            this.removedCash += amount
            removeStats.innerHTML = `Total spend money ${this.removedCash.toFixed(2)}`
        }
    }
    sortAmount() {
        const sortedHistory = this.history.map(item => ({
            ...item,
            newAmount: parseFloat(item.amount.replace(/[^0-9.]/g, ''))
        })).sort((a, b) => a.newAmount - b.newAmount)
        this.historyDisplay(sortedHistory)
    }
    sortCategory() {
        const sort = [...this.history].sort((a,b) => a.category.localeCompare(b.category))
        this.historyDisplay(sort)
    }
    sortDate() {
        const sort = [...this.history].sort((a,b) => new Date(a.date) - new Date(b.Date))
        this.historyDisplay(sort)
     
    }
    updateWalletIcon() {
        const walletIcon = document.getElementById("wallet-icon")
        if (this.money > 0) {
            walletIcon.textContent = 'account_balance_wallet'
            walletIcon.classList.add('wallet-full')
        } else {
            walletIcon.textContent = 'account_balance_wallet'
            walletIcon.classList.remove('wallet-full')
        }
    }
    exportToCSV(type) {
        const transactions = this.history
        let content = "data:text/csv;charset=utf-8,"
        let file
    
        if (type === "txt") {
            transactions.forEach(transaction => {
                const row = `${transaction.date},${transaction.amount},"${transaction.description}",${transaction.category}`
                content += row + "\n"
            });
            file = "wallet.txt"
        } else if (type === "csv") {
            content += "Amount;Description;Category;Date\n"
            transactions.forEach(transaction => {
                let formattedDate = transaction.date.replace(/[a-zA-Z]/g, '')
                let cleanedDescription = transaction.description.replace(/"/g, '""')
                let amount = ""
                for (let char of transaction.action) {
                    if ('0123456789'.includes(char)) {
                      amount += char
                    }
                  }
                
                const row = `${amount};"${cleanedDescription}";${transaction.category};${formattedDate};`
                content += row + "\n"
            });
            file = "wallet.csv"
        }
    
        const encodedUri = encodeURI(content)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", file)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    convertCurrency(amount, baseCurrency, targetCurrency) {
        const roundedAmount = Number(amount.toFixed(2))
    
        return getExchangeRate(baseCurrency, targetCurrency).then(rate => {
            let convertedAmount = roundedAmount * rate
            let roundedConvertedAmount = Number(convertedAmount.toFixed(2))
    
    
            console.log(this.currencies.USD)
            this.currencies.USD -= roundedAmount
    
            if (this.currencies[baseCurrency] >= roundedAmount) {
                this.currencies[baseCurrency] -= roundedAmount
                if (!this.currencies[targetCurrency]) {
                    this.currencies[targetCurrency] = 0
                }
                this.currencies[targetCurrency] += roundedConvertedAmount
                this.updateDisplay()
            }
        }).catch(error => {
            throw error
        })
    }
    
    
}

