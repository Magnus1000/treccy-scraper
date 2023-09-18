const username = '@mazzy';

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
      attachCreateRaceButtonListener();
      attachHighlightButtonListeners();
      prepopulateWebsiteUrl();
      startTimer();
      //logImageURLs();
      addImageAndCheckboxes();
      collectEmails();
      setUsernameText(username);
      fetchRaceData(username)
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

function attachHighlightButtonListeners() {
  // Find all buttons with the specific class
  const buttons = document.querySelectorAll('.plugin-highlight-button-83a1371d7');
  
  // Loop through each button and add a click event listener
  buttons.forEach((button) => {
    button.addEventListener('click', function() {
      // Get the highlighted text on the page
      const highlightedText = window.getSelection().toString();
      console.log("Highlighted Text: ", highlightedText); // Log the highlighted text
      
      // Find the corresponding input field. You may need to modify this to find the correct input field.
      const inputField = button.nextElementSibling;
      
      // Set the input field's value to the highlighted text
      inputField.value = highlightedText;
    });
  });
}

// Function to prepopulate the 'race_website' field with the current URL
const prepopulateWebsiteUrl = () => {
  const websiteInput = document.getElementById("race-website"); 
  if (websiteInput) {
      websiteInput.value = window.location.href;
      console.log("Prepopulated 'race-website' with the current URL");
  } else {
      console.log("The input field for 'race-website' could not be found.");
  }
};

// Function to start the timer and push the time to the drawer
let seconds = 0;

function startTimer() {
  const timerElement = document.querySelector('.plugin-timer-time-83a1371d7'); // Finding the div by its class

  setInterval(function() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(remainingSeconds).padStart(2, '0');

    timerElement.innerHTML = `${displayMinutes}:${displaySeconds}`;
  }, 1000);
}

// Function to log all image URLs on the page
function logImageURLs() {
  // Select all image elements on the page
  const images = document.querySelectorAll('img');

  // Loop through each image element
  images.forEach((image) => {
    const imageURL = image.src; // Get the source URL of the image
    const isSVG = imageURL.toLowerCase().endsWith('.svg'); // Check if the image is an SVG

    // If the image is not an SVG, print its URL to the console
    if (!isSVG) {
      console.log("Image URL:", imageURL);
    }
  });
}

// Function to collect all email addresses on the page and update the input field 
function collectEmails() {
  const bodyText = document.body.innerText; // Get all text from the body of the page
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g; // Regular expression to match email addresses
  const emails = bodyText.match(emailPattern) || []; // Find all email addresses
  const uniqueEmails = [...new Set(emails)]; // Remove duplicates

  console.log("Collected Emails:", uniqueEmails); // Log collected emails to console

  // Update the input field with ID "race-emails"
  const emailField = document.getElementById("race-emails");
  emailField.value = uniqueEmails.join(', ');
}

function setUsernameText(username) {
  // Find the div with the specific class
  const usernameElement = document.querySelector('.plugin-username-text-83a1371d7');
  
  // Check if the element exists
  if (usernameElement) {
    usernameElement.innerHTML = username;  // Set the username
    console.log("Username set successfully");  // Log success to console
  } else {
    console.error("Element with class 'plugin-username-text-83a1371d7' not found");  // Log an error message if the element does not exist
  }
}

// Fetch race count for the given username
async function fetchRaceData(username) {
  // Update the URL to include the username in the query string
  const url = `https://treccy-serverside-magnus1000.vercel.app/api/fetchAirtableData?username=${username}`;

  try {
    // Call the Vercel function
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Parse the response to JSON
    const data = await response.json();

    // Find the div with the specific class
    const raceCountElement = document.querySelector('.plugin-race-count-83a1371d7');

    // Check if the element exists
    if (raceCountElement) {
      // Populate the div with the response data
      raceCountElement.innerHTML = data.count;  // Assuming the data contains a 'response' field
      console.log(`Race count data populated successfully with ${data.count}`);  // Log success to console
    } else {
      console.error("Element with class 'plugin-race-count-83a1371d7' not found");  // Log an error message if the element does not exist
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);  // Log any errors that occur during the fetch
  }
}

// Function to find all image URLs on the page
function findAllImageURLs() {
  const imageURLs = [];  // Empty array to hold our image URLs
  const imgElements = document.querySelectorAll('img');  // Get all image elements on the page
  
  imgElements.forEach((imgElement) => {
    const src = imgElement.getAttribute('src');
    
    // Check if the src attribute exists and is not an SVG
    if (src && !src.includes('.svg')) {
      imageURLs.push(src);  // Add the image URL to our array
    }
  });

  console.log('Found image URLs:', imageURLs);  // Log the found image URLs to console
  return imageURLs;  // Return the array of image URLs
}

// Function to add multiple images and checkboxes
function addImageAndCheckboxes() {
  const imageURLs = findAllImageURLs();  // Call the function to find all image URLs
  const container = document.querySelector('.plugin-image-grid-83a1371d7');  // Get the container where the images and checkboxes will go
  const templateDiv = document.getElementById('plugin-image-template-div-83a1371d7');  // Get the template div using its unique ID
  
  imageURLs.forEach((imageURL) => {
    const clone = templateDiv.cloneNode(true);  // Clone the template div
    
    // Remove the ID from the cloned div so that it's not duplicated
    clone.removeAttribute('id');
    
    const imgElement = clone.querySelector('img');  // Find the image element inside the cloned div
    imgElement.src = imageURL;  // Set the image URL
    
    container.appendChild(clone);  // Append the cloned div to the container
  });
  
  // Hide the original template div using its unique ID
  // templateDiv.style.display = 'none';
}

// New function to handle checkbox toggle
function toggleCustomCheckbox() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
      const customCheckbox = this.previousElementSibling;
      
      if (this.checked) {
        customCheckbox.classList.add('checked');
      } else {
        customCheckbox.classList.remove('checked');
      }
    });
  });
}

