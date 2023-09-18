// Function to get the current time in the desired format
function getCurrentFormattedTime() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;  // Convert to 12-hour format and keep leading 0
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Keep leading 0
  const seconds = String(now.getSeconds()).padStart(2, '0'); // Keep leading 0
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Keep leading 0s

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// Use the function to get the formatted time and log it to the console
const formattedTime = getCurrentFormattedTime();
console.log(`content-script.js script loaded at ${formattedTime}`);

// Function to load drawer.html into the current webpage
let isDrawerInitialized = false;  // Flag to check if the drawer is already initialized

async function loadDrawer() {
  try {
    console.log('loadDrawer called at ' + getCurrentFormattedTime());  // Debugging line
    const url = chrome.runtime.getURL('drawer.html');
    const response = await fetch(url);
    const text = await response.text();
    const drawerDiv = document.createElement('div');
    drawerDiv.id = 'plugin-drawer-overlay-83a1371d7';
    drawerDiv.innerHTML = text;
    document.body.appendChild(drawerDiv);
    console.log('Drawer loaded.');

    if (!isDrawerInitialized) {
      initializeExpandCollapse();
      isDrawerInitialized = true;
    }
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

  // Function to initialize the expand/collapse feature
  function initializeExpandCollapse() {
    // Log that this function is being initialized
    console.log(`Initializing expand/collapse`);

    // Find the element with ID = expand-collapse-83a1371d7
    const expandCollapseWrapper = document.getElementById('expand-collapse-83a1371d7');

    // Check if the element exists
    if (expandCollapseWrapper) {
      // Log to console for debugging
      console.log('expand-collapse-wrapper element found');

      // Add click event listener
      expandCollapseWrapper.addEventListener('click', () => {
        // Log to console for debugging
        console.log('expand-collapse-wrapper clicked');

        // Find the element with class = plugin-expand-collapse-wrapper-83a1371d7
        const expandCollapseElement = document.querySelector('.plugin-expand-collapse-wrapper-83a1371d7');

        // Find the element with class = plugin-drawer-wrapper-83a1371d7
        const drawerWrapperElement = document.querySelector('.plugin-drawer-wrapper-83a1371d7');

        // Toggle the "collapse" class if the elements exist
        if (expandCollapseElement) {
          expandCollapseElement.classList.toggle('collapse');
          console.log('Toggled collapse class for plugin-expand-collapse-wrapper-83a1371d7');
        }

        if (drawerWrapperElement) {
          drawerWrapperElement.classList.toggle('collapse');
          console.log('Toggled collapse class for plugin-drawer-wrapper-83a1371d7');
        }
      });
    } else {
      // Log error message to console if the element with the given ID is not found
      console.error(`Element with ID = expand-collapse-83a1371d7 not found`);
    }
  }

// Function to attach the event listener and perform the data submission
function attachCreateRaceButtonListener() {
  // Log that the function is being initialized
  console.log('Attaching listener to create-race-button-83a1371d7');

  // Find the button with ID = create-race-button-83a1371d7
  const createRaceButton = document.getElementById('create-race-button-83a1371d7');

  // Check if the button exists
  if (createRaceButton) {
    // Log to console for debugging
    console.log('create-race-button-83a1371d7 element found');

    // Add click event listener to the button
    createRaceButton.addEventListener('click', async () => {
      // Log to console for debugging
      console.log('create-race-button-83a1371d7 clicked');

      // Initialize an empty JSON object
      const jsonData = {};

      // Get all input and text area fields in the form
      const formElements = document.querySelectorAll('input, textarea');

      // Loop through each field to gather data
      formElements.forEach((element) => {
        jsonData[element.id] = element.value;
      });

      // Log the collected JSON data
      console.log('Collected JSON data:', jsonData);

      // Send JSON data to Vercel serverless function
      try {
        const response = await fetch('https://treccy-serverside-magnus1000.vercel.app/api/pluginCreateData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });

        const result = await response.json();
        console.log('Server response:', result);
      } catch (error) {
        console.error('Error sending data:', error);
      }
    });
  } else {
    // Log error message to console if the button with the given ID is not found
    console.error('Element with ID = create-race-button-83a1371d7 not found');
  }
}