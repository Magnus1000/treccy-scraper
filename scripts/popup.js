// popup.js
document.addEventListener("DOMContentLoaded", function() {
    const checkbox = document.getElementById("popup-toggle");
    checkbox.addEventListener("change", function() {
        console.log("Checkbox changed:", this.checked);
        
        // Send message to content script to load the scraperCode.html
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "action": "toggle", "status": checkbox.checked });
        });
    });
});
