// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'loadDrawer') {
      loadDrawer(); // Call the function to load the HTML overlay
    }
  });
  
  // Function to load drawer.html into the current webpage
  async function loadDrawer() {
    try {
      const url = chrome.runtime.getURL('drawer.html'); // Get fully qualified URL
      const response = await fetch(url); // Fetch the local HTML file
      const text = await response.text(); // Get the HTML as text
      const drawerDiv = document.createElement('div'); // Create a new DIV
      drawerDiv.id = 'drawer-overlay'; // Set the ID of the DIV
      drawerDiv.innerHTML = text; // Insert the HTML into the DIV
      document.body.appendChild(drawerDiv); // Append the DIV to the body of the page
    } catch (error) {
      console.error('Failed to load drawer:', error); // Log errors if any
    }
  }

  // Add click event listener for the "expand-collapse" button
document.addEventListener('DOMContentLoaded', () => {
    const expandCollapseBtn = document.getElementById('expand-collapse');
    if (expandCollapseBtn) {
      expandCollapseBtn.addEventListener('click', toggleDrawerCollapse);
    }
  });
  
  // Initial code to listen for the toggle element being clicked.
  document.addEventListener('DOMContentLoaded', () => {
    const popupToggle = document.getElementById('popup-toggle-83a1371d7');
    if (popupToggle) {
      console.log('Element found on page load');
      popupToggle.addEventListener('click', () => {
        console.log('toggle clicked');
        loadDrawer();
      });
    }
  });
  
  // Function to toggle "collapse" class for the "drawer-wrapper" div
function toggleDrawerCollapse() {
    const drawerWrapper = document.querySelector('.drawer-wrapper');
    if (drawerWrapper) {
      drawerWrapper.classList.toggle('collapse');
    }
  }

