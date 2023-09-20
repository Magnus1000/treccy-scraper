console.log(`popup.js script loaded at ${Date.now()} ms`);

// Initialize the popup checkbox state
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded event fired, script will proceed");
  const popupToggle = document.getElementById('popup-toggle-83a1371d7');
  
  if (popupToggle === null) {
    console.log("Error: Checkbox element not found");
    return;
  }

  // Fetch the stored checkbox state from chrome.storage
  chrome.runtime.sendMessage({ action: 'getCheckboxState' }, (response) => {
    console.log("Received response for 'getCheckboxState'", response);
    if (response) {
      popupToggle.checked = true;
    } else {
      popupToggle.checked = false;
    }
  });

  // Add a click listener to the checkbox
  popupToggle.addEventListener('click', () => {
    console.log("Checkbox clicked, sending message to store state and possibly load the drawer");
    chrome.runtime.sendMessage({ action: 'storeCheckboxState', value: popupToggle.checked });

    if (popupToggle.checked) {
      console.log("Checkbox is checked, sending message to load the drawer");
      chrome.runtime.sendMessage({ action: 'loadDrawer' });
    }
  });
});