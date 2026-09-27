let ClickedON = document.querySelector ('#ON')
let ClickedOFF = document.querySelector ('#OFF')

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    ClickedON.addEventListener('click', function() {
        chrome.tabs.sendMessage(tabs[0].id, {action: "ON"})
    })
    ClickedOFF.addEventListener('click', function() {
        chrome.tabs.sendMessage(tabs[0].id, {action: "OFF"})
    })
})