export class Wallet {
    constructor(money) {
        this.money = money
        this.history = []
    }

    addMoney(amount, description, category, date = new Date()) {
        this.money += amount
        this.updateDisplay()
        this.updateHistory(`<i class="material-icons icon">add</i>${amount}$`, `Description: ${description}`, `Type: ${category}`, category, `Date: ${date.toLocaleString('pl-PL')}`)
    }
    removeMoney(amount, description, category, date = new Date()){
        this.money -= amount
        this.updateDisplay()
        this.updateHistory(`<i class="material-icons icon">remove_circle</i>${amount}$`, `Description: ${description}`, `Type: ${category}`, category, `Date: ${date.toLocaleString('pl-PL')}`)

    }
    updateDisplay() {
        document.getElementById("account").textContent = this.money
        this.updateWalletIcon()
    }
    updateHistory(action, description, category, amount, date) {
        this.history.push({action, description, category, amount, date})
        this.historyDisplay()

    }
    historyDisplay(sortedHistory = this.history) {
        const historyElement = document.getElementById("history")
        historyElement.innerHTML = '<ul class="collection"></ul>'
        const ul = historyElement.querySelector('.collection')
        sortedHistory.forEach(element => {
            let listItem = document.createElement("li")
            listItem.innerHTML = `${element.action}, ${element.description}, ${element.category}, ${element.date}`
            listItem.className = 'collection-item'
            ul.appendChild(listItem)
        })
    }
    sortAmount() {
        const sort = [...this.history].sort((a, b) => a.amount - b.amount)
        this.historyDisplay(sort)
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
                      amount += char;
                    }
                  }
                
                const row = `${amount};"${cleanedDescription}";${transaction.category};${formattedDate};`
                content += row + "\n"
            });
            file = "wallet.csv"
        }
    
        const encodedUri = encodeURI(content);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    


}

