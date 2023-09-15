// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'loadDrawer') {
      loadDrawer(); // Call the function to load the HTML overlay
    }
  });
  
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
  
  // Function to toggle "collapse" class for the "drawer-wrapper" div
  function toggleDrawerCollapse() {
    const drawerWrapper = document.querySelector('.drawer-wrapper');
    if (drawerWrapper) {
      drawerWrapper.classList.toggle('collapse');
    }
  }
  
  // Initial code to listen for the toggle element and its state
  document.addEventListener('DOMContentLoaded', () => {
    const popupToggle = document.getElementById('popup-toggle-83a1371d7');
    if (popupToggle) {
      console.log('Element found on page load');
  
      // Fetch the stored checkbox state from chrome.storage
      chrome.storage.local.get(['checkboxState'], function(result) {
        if (result.checkboxState) {
          popupToggle.checked = true;
          loadDrawer(); // If the stored state is checked, load the drawer
        }
      });
  
      popupToggle.addEventListener('click', () => {
        console.log('toggle clicked');
        if (popupToggle.checked) {
          // Store the checkbox state as 'checked'
          chrome.storage.local.set({ 'checkboxState': true }, function() {
            console.log('Checkbox state saved as checked');
          });
          loadDrawer();
        } else {
          // Store the checkbox state as 'unchecked'
          chrome.storage.local.set({ 'checkboxState': false }, function() {
            console.log('Checkbox state saved as unchecked');
          });
        }
      });
    }
  });