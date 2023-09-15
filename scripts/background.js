// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'loadDrawer') {
      // Send a message to content script to load drawer
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Check if tabs array is empty or if the first tab is undefined
        if (tabs.length === 0 || !tabs[0]) {
          console.error('No active tab found');
          return;
        }
  
        // Proceed to send message to content script
        chrome.tabs.sendMessage(tabs[0].id, { action: 'loadDrawer' });
      });
    }
  });
  