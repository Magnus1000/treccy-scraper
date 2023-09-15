// Function to initialize the plugin
function initializePlugin() {
    // Find the element by its ID
    const toggleElement = document.getElementById("popup-toggle-83a1371d7");
  
    // Check if the element is found
    if (toggleElement) {
      console.log("Element found!"); // Log to the console if the element is found
  
      // Add a click event listener to the toggle element
      toggleElement.addEventListener("click", function () {
        console.log("toggle clicked"); // Log to the console when the element is clicked
      });
    } else {
      console.log("Element not found!"); // Log to the console if the element is not found
    }
  }
  
  // Call the initializePlugin function when the document is fully loaded
  document.addEventListener("DOMContentLoaded", initializePlugin);
  