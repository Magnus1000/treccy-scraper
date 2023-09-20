// Function to get the current time in the desired format
function getCurrentFormattedTime() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;  // Convert to 12-hour format and keep leading 0
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Keep leading 0
  const seconds = String(now.getSeconds()).padStart(2, '0'); // Keep leading 0
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Keep leading 0s

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

const popUpLoadTime = getCurrentFormattedTime();
console.log(`popup.js loaded at ${popUpLoadTime}`);

// Function to toggle the "hidden" class for reaction divs based on checkbox state
function toggleReactionDivs(checkboxState) {
  const startReactionDiv = document.getElementById('popup-text-start-toggle-reaction-83a1371d7');
  const finishReactionDiv = document.getElementById('popup-text-finish-toggle-reaction-83a1371d7');

  if (checkboxState) {
    startReactionDiv.classList.remove('hidden');
    finishReactionDiv.classList.add('hidden');
  } else {
    startReactionDiv.classList.add('hidden');
    finishReactionDiv.classList.remove('hidden');
  }
  console.log(`Toggled the hidden class for reaction divs based on checkbox state: ${checkboxState}`);
}

// Function to toggle the "hidden" class for text divs when the popup shows and hides
function toggleTextDivs(show) {
  const gettingStartedDiv = document.getElementById('popup-text-getting-started-83a1371d7');
  const finishingDiv = document.getElementById('popup-text-finishing-83a1371d7');

  if (show) {
    gettingStartedDiv.classList.add('hidden');
    finishingDiv.classList.remove('hidden');
  } else {
    gettingStartedDiv.classList.remove('hidden');
    finishingDiv.classList.add('hidden');
  }
  console.log(`Toggled the hidden class for text divs based on popup state: ${show ? 'show' : 'hide'}`);
}

// Function to toggle the "hidden" class for text divs when the popup shows and hides
function toggleBothTextDivs() {
  const gettingStartedDiv = document.getElementById('popup-text-getting-started-83a1371d7');
  const finishingDiv = document.getElementById('popup-text-finishing-83a1371d7');

  gettingStartedDiv.classList.add('hidden');
  finishingDiv.classList.add('hidden');
  console.log(`Toggled the hidden class for both text divs`);
}

// Initialize the popup checkbox state
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded event fired, script will proceed");
  const popupToggle = document.getElementById('popup-toggle-checkbox-83a1371d7');
  
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
    toggleTextDivs(popupToggle.checked);
  });

  // Add a click listener to the checkbox
  popupToggle.addEventListener('click', () => {
    console.log("Checkbox clicked, sending message to store state and possibly load the drawer");
    chrome.runtime.sendMessage({ action: 'storeCheckboxState', value: popupToggle.checked });

    if (popupToggle.checked) {
      console.log("Checkbox is checked, sending message to load the drawer");
      chrome.runtime.sendMessage({ action: 'loadDrawer' });
    }
    toggleReactionDivs(popupToggle.checked);
    toggleBothTextDivs();
  });
});