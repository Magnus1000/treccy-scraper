document.addEventListener("DOMContentLoaded", function () {
  const toggleElement = document.getElementById("popup-toggle-83a1371d7");
  
  if (toggleElement) {
    console.log("Element found!");
    
    toggleElement.addEventListener("click", function () {
      console.log("toggle clicked");
      
      if (toggleElement.checked) {
        // Send message to background.js to load drawer
        chrome.runtime.sendMessage({ action: 'loadDrawer' });
      }
    });
  } else {
    console.log("Element not found!");
  }
});
