import { Wallet } from './wallet.js'

let money = 0
document.getElementById("account").textContent = money
document.getElementById("history").textContent = ''
const myWallet = new Wallet(money)



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
    toggleExportDialog(true);
})

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
document.getElementById("close-button").addEventListener("click", () => toggleExportDialog(false))





