// background.js

// Function to store the checkbox state
function storeCheckboxState(isChecked) {
    chrome.storage.local.set({ 'checkboxState': isChecked }, function() {
        console.log('Checkbox state saved: ', isChecked);
    });
}

// Function to get the stored checkbox state
function getCheckboxState(callback) {
    chrome.storage.local.get(['checkboxState'], function(result) {
        callback(result.checkboxState);
    });
}

// Function to send message to content script to load the drawer
function sendDrawerMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0 || !tabs[0]) {
            console.error('No active tab found');
            return;
        }
        chrome.tabs.sendMessage(tabs[0].id, { action: 'loadDrawer' });
    });
}

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'contentScriptReady') {
        getCheckboxState((isChecked) => {
            if (isChecked) {
                sendDrawerMessage();
            }
        });
    } else if (message.action === 'loadDrawer') {
        sendDrawerMessage();
    } else if (message.action === 'getCheckboxState') {
        getCheckboxState((isChecked) => {
            sendResponse(isChecked);
        });
        return true; // Keep the message channel open
    } else if (message.action === 'storeCheckboxState') {
        storeCheckboxState(message.value);
    }
});
