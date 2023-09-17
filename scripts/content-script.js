console.log(`content-script.js script loaded at ${Date.now()} ms`); 

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

    // Add event listener to the "expand-collapse" element
    const expandCollapseButton = document.getElementById('expand-collapse');
    if (expandCollapseButton) {
      expandCollapseButton.addEventListener('click', () => {
        // Your code for handling the click event here
        console.log('Expand-Collapse button clicked.');
        // Add your logic here to expand or collapse the drawer
      });
    } else {
      console.error('Element with ID "expand-collapse" not found in drawer.html.');
    }
  } catch (error) {
    console.error('Failed to load drawer:', error);
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


