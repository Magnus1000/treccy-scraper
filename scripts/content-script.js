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
  
  // Initial code to listen for the toggle element and its state
  document.addEventListener('DOMContentLoaded', () => {
    const popupToggle = document.getElementById('popup-toggle-83a1371d7');
    if (popupToggle) {
      // Fetch the stored checkbox state from chrome.storage
      chrome.runtime.sendMessage({ action: 'getCheckboxState' }, (response) => {
        if (response) {
          popupToggle.checked = true;
          loadDrawer(); // If the stored state is checked, load the drawer
        }
      });
  
      popupToggle.addEventListener('click', () => {
        if (popupToggle.checked) {
          chrome.runtime.sendMessage({ action: 'storeCheckboxState', value: true });
          loadDrawer();
        } else {
          chrome.runtime.sendMessage({ action: 'storeCheckboxState', value: false });
        }
      });
    }
  });
  