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
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'loadDrawer') {
      // Fetch the stored checkbox state
      getCheckboxState((isChecked) => {
        if (isChecked) {
          // Send a message to content script to load drawer
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0 || !tabs[0]) {
              console.error('No active tab found');
              return;
            }
            chrome.tabs.sendMessage(tabs[0].id, { action: 'loadDrawer' });
          });
        }
      });
    }
  });
  