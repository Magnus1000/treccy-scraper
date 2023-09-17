  // Function to load drawer.html into the current webpage
  async function loadDrawer() {
    try {
      const url = chrome.runtime.getURL('drawer.html');
      const response = await fetch(url);
      const text = await response.text();
      const drawerDiv = document.createElement('div');
      drawerDiv.id = 'drawer-overlay';
      drawerDiv.innerHTML = text;
      document.body.appendChild(drawerDiv);
      console.log('Drawer loaded.');
    } catch (error) {
      console.error('Failed to load drawer:', error);
    }
  }
  
  // Listen for messages from background.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'loadDrawer') {
      loadDrawer(); // Call the function to load the HTML overlay
    }
  });

  // Initial code to check if the toggle should be set and the drawer loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Send a message to background script to indicate that the content script is ready
    chrome.runtime.sendMessage({ action: 'contentScriptReady' }, (response) => {
      console.log('Sent contentScriptReady message.');
    });

    // Fetch the stored checkbox state from chrome.storage
    chrome.storage.local.get(['checkboxState'], function(result) {
      if (result.checkboxState) {
        loadDrawer(); // If the stored state is checked, load the drawer
      }
    });
  });