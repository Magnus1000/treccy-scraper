console.log(`popup.js script loaded at ${Date.now()} ms`);

// Initialize the popup checkbox state
document.addEventListener('DOMContentLoaded', () => {
const popupToggle = document.getElementById('popup-toggle-83a1371d7');

// Fetch the stored checkbox state from chrome.storage
chrome.runtime.sendMessage({ action: 'getCheckboxState' }, (response) => {
  if (response) {
    popupToggle.checked = true;
  } else {
    popupToggle.checked = false;
  }
});

// Add a click listener to the checkbox
popupToggle.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'storeCheckboxState', value: popupToggle.checked });
  if (popupToggle.checked) {
    chrome.runtime.sendMessage({ action: 'loadDrawer' });
  }
});
});