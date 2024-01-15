import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'


const appSettings = {
    databaseURL: "https://items-lister-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase()
const listedItems = ref(database, "list")
let itemsArray = []

const itemsEl = document.getElementById("shopping-list")
const inputEl = document.getElementById("input-el")
const addItem = document.getElementById("add-button")
const errorEl = document.getElementById("error")


addItem.addEventListener("click", function() {
    let itemValue = inputEl.value;
    if (itemValue !== "" ){
        if (itemsArray.includes(itemValue) === false) {
            push(listedItems, itemValue)
            console.log(`${itemValue} added to database`)
            errorEl.textContent = ""
        }
    
        else {
            errorEl.textContent = "Item already exists"
            console.log("Item already exists")
        }
    clearInputField()
    }
})

inputEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addItem.click()
    }
})


function renderItems(items) {

    let itemID = items[0]
    let itemName = items[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemName
    newEl.value = itemID
    newEl.addEventListener("click", function() {
        let itemLocation = ref(database, `list/${itemID}`)
        remove(itemLocation)
    })
    
    itemsEl.append(newEl)
}

onValue(listedItems, function(snapshot) {
    // Getting the items from Firebase realtime database and rendering them in the page
    itemsEl.innerHTML = ""
    let items = Object.entries(snapshot.val())
    for (let i = 0; i < items.length; i++) {
        let item = items[i]
        renderItems(item)
    }
})



function clearInputField() {
    inputEl.value = "" // Clearing input Field
}