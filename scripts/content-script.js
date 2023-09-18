console.log(`content-script.js script loaded at ${Date.now()} ms`); 

// Function to load drawer.html into the current webpage
async function loadDrawer() {
  try {
    const url = chrome.runtime.getURL('drawer.html');
    const response = await fetch(url);
    const text = await response.text();
    const drawerDiv = document.createElement('div');
    drawerDiv.id = 'plugin-drawer-overlay-83a1371d7';
    drawerDiv.innerHTML = text;
    document.body.appendChild(drawerDiv);
    console.log('Drawer loaded.');
  } catch (error) {
    console.log('Failed to load drawer: ', error);
  }
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'loadDrawer') {
    console.log('Received loadDrawer message.');
    // Call the function to load the HTML overlay
    loadDrawer(); 
  }
});

// Initial code to check if the toggle should be set and the drawer loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired in content script.'); // Debugging line
  // Send a message to background script to indicate that the content script is ready
  chrome.runtime.sendMessage({ action: 'contentScriptReady' }, (response) => {
    console.log('Sent contentScriptReady message.');
  });

  // Fetch the stored checkbox state from chrome.storage
  chrome.storage.local.get(['checkboxState'], function(result) {
    if (result.checkboxState) {
      console.log('Checkbox state is true, loading drawer.'); // Debugging line
      loadDrawer(); // If the stored state is checked, load the drawer
    } else {
      console.log('Checkbox state is false or undefined.'); // Debugging line
    }
  });
});


