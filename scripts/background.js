// background.js
console.log(`background.js script loaded at ${Date.now()} ms`);

// Function to store the checkbox state
function storeCheckboxState(isChecked) {
    chrome.storage.local.set({ 'checkboxState': isChecked }, function() {
        console.log('Checkbox state saved: ', isChecked);
    });
}

// Function to get the stored checkbox state
function getCheckboxState(callback) {
    chrome.storage.local.get(['checkboxState'], function(result) {
        console.log('Retrieved checkbox state: ', result.checkboxState);
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
        console.log('Sending loadDrawer message to content script.');
        chrome.tabs.sendMessage(tabs[0].id, { action: 'loadDrawer' });
    });
}

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message: ', message.action);
    if (message.action === 'contentScriptReady') {
        console.log('contentScriptReady message received.');
        getCheckboxState((isChecked) => {
            if (isChecked) {
                console.log('On Pageload. Checkbox is checked. Sending drawer message.');
                sendDrawerMessage();
            }
            sendResponse(true);
        });
        return true;
    } else if (message.action === 'loadDrawer') {
        console.log('loadDrawer message received.');
        sendDrawerMessage();
    } else if (message.action === 'getCheckboxState') {
        console.log('getCheckboxState message received.');
        getCheckboxState((isChecked) => {
            sendResponse(isChecked);
        });
        return true; // Keep the message channel open
    } else if (message.action === 'storeCheckboxState') {
        console.log('storeCheckboxState message received.');
        storeCheckboxState(message.value);
    }
});
