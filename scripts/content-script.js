const username = '@mazzy';
const formated_start_time = getCurrentFormattedTime();
const start_time = Math.floor(new Date().getTime() / 1000);
const requiredRaceFields = ['race-name', 'race-description', 'race-location', 'race-date', 'race-time'];
const requiredCourseFields = ['plugin-course-form-race-name-83a1371d7'];
// Declare the variable without initializing it
let addedImageURLs;

console.log(`Started at ${formated_start_time}`);

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
      attachCreateCourseButtonListener();
      attachHighlightButtonListeners();
      prepopulateWebsiteUrl();
      startTimer();
      collectEmails();
      setUsernameText(username);
      fetchRaceData(username);
      allowSingleMainCheckbox();
      populateFormFields();
      attachFormStateListeners();
      processAndSaveImages();
      if (document.getElementById('form-type').value === 'race' ) {
        addImageAndCheckboxes('plugin-race-image-grid-83a1371d7','plugin-race-image-template-div-83a1371d7');
      };
      if (document.getElementById('form-type').value === 'course' ) {
        addImageAndCheckboxes('plugin-course-image-grid-83a1371d7','plugin-course-image-template-div-83a1371d7');
      };               
      showHideForm();
      document.getElementById('form-type').addEventListener('change', showHideForm);
      attachRaceNameListener();
      toggleCustomCheckbox();
      setupSearchSuggestions('race-location', 'plugin-race-location-suggestions-83a1371d7');
      toggleAdditionalSportsVisibility();
      attachRefreshButtonListener('plugin-refresh-race-images-button-83a1371d7','plugin-race-image-grid-83a1371d7','plugin-race-image-template-div-83a1371d7');
      attachRefreshButtonListener('plugin-refresh-course-images-button-83a1371d7','plugin-course-image-grid-83a1371d7','plugin-course-image-template-div-83a1371d7');
      attachSportToggleListener();
      attachClearFormButtonRevealListener();
      attachClearFormConfirmationButtonListener();
      attachGlobalDropdownKeyListener();
      checkFormFields('race-details-form', requiredRaceFields, 'main', 'gallery', 'create-race-button-83a1371d7');
      checkFormFields('course-details-form', requiredCourseFields, 'main-course', 'gallery-course', 'create-course-button-83a1371d7');
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

// Function to attach the event listener to the create race button and perform the data submission
function attachCreateRaceButtonListener() {
  console.log('Attaching listener to create-race-button-83a1371d7');
  
  const createRaceButton = document.getElementById('create-race-button-83a1371d7');
  
  if (createRaceButton) {
    console.log('create-race-button-83a1371d7 element found');
    
    createRaceButton.addEventListener('click', async () => {
      // Check if the button is disabled
      if (createRaceButton.disabled) {
        console.log('Button is disabled, not executing click action.');
        return; // Skip the rest of the logic
      }

      // Disable the button and change its text and opacity
      createRaceButton.disabled = true;
      createRaceButton.style.opacity = '0.5';
      createRaceButton.innerText = 'Waiting...';

      const formatted_end_time = getCurrentFormattedTime();
      const end_time = Math.floor(new Date().getTime() / 1000);
      console.log(`Finished at ${formatted_end_time}`);

      let jsonData = {};

      const getImgUrlFromParent = (checkbox) => {
        const parentDiv = checkbox.closest('.plugin-image-and-checkbox-wrapper-83a1371d7');
        const imgElement = parentDiv.querySelector('.plugin-image-83a1371d7');
        return imgElement ? imgElement.src : "";
      };

      // Find checked checkbox for main photo
      const mainCheckbox = document.querySelector('input[data-type="main"]:checked');
      const mainImageURL = mainCheckbox ? getImgUrlFromParent(mainCheckbox) : "";

      // Find checked checkboxes for gallery and get their URLs
      const galleryCheckboxes = document.querySelectorAll('input[data-type="gallery"]:checked');
      const galleryImageURLs = Array.from(galleryCheckboxes).map(cb => getImgUrlFromParent(cb));

      	
      // Use the new function to get form elements only from 'race-details-form'
      const formElements = getFormElements('race-details-form');
      
      formElements.forEach((element) => {
        if (element.type === "checkbox") {
          jsonData[element.id] = element.checked;
        } else if (element.tagName === "SELECT") {
          jsonData[element.id] = element.options[element.selectedIndex].value;
        } else {
          jsonData[element.id] = element.value;
        }
      });

      jsonData.formType = "race";
      jsonData.start_time = start_time;
      jsonData.end_time = end_time;
      jsonData.mainImageURL = mainImageURL;
      jsonData.galleryImageURLs = galleryImageURLs;
      jsonData.username = username;

      // Added: Fetch the additional Mapbox data and add it to jsonData
      const raceLocationElement = document.getElementById('race-location');
      if (raceLocationElement) {
        jsonData['race_location_lat'] = raceLocationElement.getAttribute('data-lat');
        jsonData['race_location_lon'] = raceLocationElement.getAttribute('data-lon');
        jsonData['race_location_region'] = raceLocationElement.getAttribute('data-region');
        jsonData['race_location_city'] = raceLocationElement.getAttribute('data-city');
        jsonData['race_location_country'] = raceLocationElement.getAttribute('data-country');
      } else {
        console.error('Element with ID = race-location not found');
      }

      console.log('Collected JSON data:', jsonData);

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

        // Once response is received, enable the button and revert text and opacity
        createRaceButton.disabled = false;
        createRaceButton.style.opacity = '1';
        createRaceButton.innerText = 'Create Race';

        // Assume a 200 status indicates success
        const isSuccess = (result.status === '200');
        updateDivWithResponse(JSON.stringify(result), isSuccess);

      } catch (error) {
        // If an error occurs, enable the button and revert text and opacity
        createRaceButton.disabled = false;
        createRaceButton.style.opacity = '1';
        createRaceButton.innerText = 'Create Race';

        console.error('Error sending data:', error);

        // Update the div with the error message
        updateDivWithResponse(`Error: ${error.message}`, false);
      }
    });
  } else {
    console.error('Element with ID = create-race-button-83a1371d7 not found');
  }
}

// New function to get the value of a single checkbox by its ID
function getSingleCheckboxValue(id) {
  const checkboxElement = document.getElementById(id);
  if (checkboxElement) {
    return checkboxElement.checked;
  }
  return null;
}

// Function to get form elements from a specific form
function getFormElements(formId) {
  const form = document.getElementById(formId);
  if (form) {
    return form.querySelectorAll('input, textarea, select');
  }
  return [];
}

// Function to attach the event listener to the create course button and perform the data submission
function attachCreateCourseButtonListener() {
  console.log('Attaching listener to create-course-button-83a1371d7');
  
  const createCourseButton = document.getElementById('create-course-button-83a1371d7');
  
  if (createCourseButton) {
    console.log('create-course-button-83a1371d7 element found');
    
    createCourseButton.addEventListener('click', async () => {
      console.log('create-course-button-83a1371d7 clicked');

      // Disable the button and change its text and opacity
      createCourseButton.disabled = true;
      createCourseButton.style.opacity = '0.5';
      createCourseButton.innerText = 'Patience, champ...';

      const end_time = getCurrentFormattedTime();

      console.log(`Finished at ${end_time}`);

      let jsonData = {};

      const getImgUrlFromParent = (checkbox) => {
        const parentDiv = checkbox.closest('.plugin-image-and-checkbox-wrapper-83a1371d7');
        const imgElement = parentDiv.querySelector('.plugin-image-83a1371d7');
        return imgElement ? imgElement.src : "";
      };

      // Find checked checkbox for main course photo
      const mainCheckbox = document.querySelector('input[data-type="course-main"]:checked');
      const mainImageURL = mainCheckbox ? getImgUrlFromParent(mainCheckbox) : "";

      // Find checked checkboxes for course gallery photos and get their URLs
      const galleryCheckboxes = document.querySelectorAll('input[data-type="course-gallery"]:checked');
      const galleryImageURLs = Array.from(galleryCheckboxes).map(cb => getImgUrlFromParent(cb));

      // Find checked checkboxes for course map and get their URLs
      const mapCheckboxes = document.querySelectorAll('input[data-type="course-map"]:checked');
      const mapImageURLs = Array.from(mapCheckboxes).map(cb => getImgUrlFromParent(cb));

      // Use the new function to get form elements only from 'course-details-form'
      const formElements = getFormElements('course-details-form');
      
      formElements.forEach((element) => {
        if (element.type === "checkbox") {
          jsonData[element.id] = element.checked;
        } else if (element.tagName === "SELECT") {
          jsonData[element.id] = element.options[element.selectedIndex].value;
        } else {
          jsonData[element.id] = element.value;
        }
      });

      jsonData.formType = "course";
      jsonData.start_time = start_time;
      jsonData.end_time = end_time;
      jsonData.mainImageURL = mainImageURL;
      jsonData.galleryImageURLs = galleryImageURLs;
      jsonData.mapImageURLs = mapImageURLs;
      jsonData.username = username;

      // Use the new function to get the checkbox value by its ID and include it in jsonData
      const checkboxValue = getSingleCheckboxValue('drawer-toggle-83a1371d7');
      if (checkboxValue !== null) {
        jsonData['drawer-toggle-83a1371d7'] = checkboxValue;
      }

      console.log('Collected JSON data:', jsonData);

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

        // Once response is received, enable the button and revert text and opacity
        createCourseButton.disabled = false;
        createCourseButton.style.opacity = '1';
        createCourseButton.innerText = 'Create Course';

        // Assume a 200 status indicates success
        const isSuccess = (result.status === '200');
        updateDivWithResponse(JSON.stringify(result), isSuccess);

      } catch (error) {
        // If an error occurs, enable the button and revert text and opacity
        createCourseButton.disabled = false;
        createCourseButton.style.opacity = '1';
        createCourseButton.innerText = 'Create Course';

        console.error('Error sending data:', error);

        // Update the div with the error message
        updateDivWithResponse(`Error: ${error.message}`, false);
      }
    });
  } else {
    console.error('Element with ID = create-course-button-83a1371d7 not found');
  }
}

// Function to update the content of the div with ID 'plugin-success-and-error-message-83a1371d7'
function updateDivWithResponse(responseText, isSuccess) {
  const messageDiv = document.getElementById('plugin-success-and-error-message-83a1371d7');
  if (messageDiv) {
    // Clear existing classes 'success' and 'error'
    messageDiv.classList.remove('success', 'error');

    // Add the class based on isSuccess flag
    if (isSuccess) {
      messageDiv.classList.add('success');
    } else {
      messageDiv.classList.add('error');
    }

    // Check if the responseText is JSON and handle it
    try {
      const jsonResponse = JSON.parse(responseText);
      if (jsonResponse.status === '200') {
        messageDiv.innerHTML = `${jsonResponse.message} – <a href="${jsonResponse.url}" target="_blank" class="plugin-view-course-race-link-83a1371d7">${jsonResponse.cta}</a>`;
      } else {
        messageDiv.innerHTML = jsonResponse.message || 'An error occurred.';
      }
    } catch (e) {
      messageDiv.innerHTML = responseText;
    }
  }
}

// Declare a variable to hold the highlighted text
let highlightedText = "";

// Function to update highlighted text
function updateHighlightedText() {
  highlightedText = window.getSelection().toString();
}

// Function for mousedown event
function handleMousedown(event) {
  event.preventDefault();
  console.log("Highlighted Text:", highlightedText);

  // Find the closest wrapper div for this button
  const parentWrapper = event.target.closest('.plugin-input-field-wrapper-83a1371d7, .plugin-text-area-wrapper-83a1371d7');

  // Find the input or textarea field inside the parent wrapper div
  const inputField = parentWrapper.querySelector('.plugin-input-fields-83a1371d7, .plugin-text-area-input-83a1371d7');

  // Check if the inputField or textarea exists
  if (inputField) {
    // Set the input or textarea field's value to the highlighted text
    inputField.value = highlightedText;
  } else {
    console.log("Input or textarea field not found"); // Log error if neither is found
  }
}

function attachHighlightButtonListeners() {
  // Remove any existing selectionchange event listener
  document.removeEventListener('selectionchange', updateHighlightedText);

  // Attach new selectionchange event listener
  document.addEventListener('selectionchange', updateHighlightedText);

  const buttons = document.querySelectorAll('.plugin-highlight-button-83a1371d7');

  buttons.forEach((button) => {
    // Remove any existing mousedown event listener
    button.removeEventListener('mousedown', handleMousedown);

    // Attach new mousedown event listener
    button.addEventListener('mousedown', handleMousedown);
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
  // Get the current domain where the extension is running
  const raceDomain = window.location.hostname;

  // Update the URL to include the username and raceDomain in the query string
  const url = `https://treccy-serverside-magnus1000.vercel.app/api/fetchAirtableData?username=${username}&race_domain=${raceDomain}`;

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
      raceCountElement.innerHTML = data.count;
      console.log(`Race count data populated successfully with ${data.count}`);
      console.log(`Other races found for this domain: ${JSON.stringify(data.raceRecords, null, 2)}`);
      console.log(`Sports for dropdown: ${JSON.stringify(data.sportRecords, null, 2)}`);
    } else {
      console.error("Element with class 'plugin-race-count-83a1371d7' not found");
    }

    // Find the race name dropdown by ID
    const dropdownElement = document.getElementById("plugin-course-form-race-name");

    // Check if the dropdown element exists
    if (dropdownElement) {
      // Clear existing options
      dropdownElement.innerHTML = '';

      // Populate dropdown with race names
      data.raceRecords.forEach(record => {
        const option = document.createElement('option');
        option.value = record.airtable_record_id_at;
        option.textContent = `${record.name_at} (${record.age_at} ago)`;
        dropdownElement.appendChild(option);
      });

      console.log('Populated the race name dropdown successfully.');
      attachRaceNameListener();

    } else {
      console.error("Element with ID 'plugin-course-form-race-name' not found");
    }

    // Find all sports dropdowns by data-type attribute
    const sportsDropdowns = document.querySelectorAll('select[data-type="sport"]');

    // Check if there are any dropdowns
    if (sportsDropdowns.length > 0) {
      sportsDropdowns.forEach(dropdown => {
        // Clear existing options
        dropdown.innerHTML = '';

        // Add placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Select sport';
        placeholderOption.selected = true;
        placeholderOption.disabled = false;
        dropdown.appendChild(placeholderOption);

        // Populate dropdown with sport names
        data.sportRecords.forEach(record => {
          const option = document.createElement('option');
          option.value = record.airtable_record_id_at;
          option.textContent = record.name_at;
          dropdown.appendChild(option);
        });
      });

      console.log('Populated the sports dropdowns successfully.');
    } else {
      console.error('No elements with data-type "sport" found');
    }

  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// Function to load image URLs from sessionStorage into the Set
function loadImageURLsFromSessionStorage() {
  if (sessionStorage.getItem('addedImageURLs')) {
    const storedImageURLsArray = JSON.parse(sessionStorage.getItem('addedImageURLs'));
    addedImageURLs = new Set(storedImageURLsArray); // Initialize the Set with stored image URLs
    console.log('Image URLs set loaded from sessionStorage:', storedImageURLsArray);
  } else {
    addedImageURLs = new Set(); // Initialize an empty Set to hold image URLs that have been added
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

// Function to save the image set to sessionStorage
function saveImageSetToSessionStorage() {
  // Convert the Set to an array
  const addedImageURLsArray = Array.from(addedImageURLs);

  // Save the array to sessionStorage as a JSON string
  sessionStorage.setItem('addedImageURLs', JSON.stringify(addedImageURLsArray));

  console.log('Image URLs set saved:', addedImageURLsArray);
}

// Main function to find all image URLs, remove duplicates, and save to session storage
function processAndSaveImages() {
  // Step 1: Check if there are any images in session storage
  if (sessionStorage.getItem('addedImageURLs')) {
    // If yes, load existing image URLs from session storage into Set
    loadImageURLsFromSessionStorage();
  } else {
    // If not, initialize an empty Set to hold image URLs that will be added
    addedImageURLs = new Set();
  }

  // Step 2: Find all image URLs on the page
  const foundImageURLs = findAllImageURLs();

  // Step 3: Add the found image URLs to our Set (this will automatically remove duplicates)
  foundImageURLs.forEach(url => {
    addedImageURLs.add(url);
  });

  // Step 4: Save the updated image URLs set to session storage
  saveImageSetToSessionStorage();

  console.log('Image URLs processed and saved.');
}

// Function to add multiple images and checkboxes, now accepts container and template IDs as parameters
function addImageAndCheckboxes(containerID, templateDivID) {
  console.log(`Adding images and checkboxes to container: ${containerID}`); // Log function call
  
  // Load existing image URLs from session storage into Set
  loadImageURLsFromSessionStorage();
  
  const imageURLs = Array.from(addedImageURLs); // Convert the Set of image URLs to an array
  const container = document.getElementById(containerID); // Get the container where the images and checkboxes will go
  const templateDiv = document.getElementById(templateDivID); // Get the template div using its ID from the parameter

  imageURLs.forEach((imageURL) => {
    const clone = templateDiv.cloneNode(true); // Clone the template div

    // Remove the ID from the cloned div so that it's not duplicated
    clone.removeAttribute('id');

    const imgElement = clone.querySelector('img'); // Find the image element inside the cloned div
    imgElement.src = imageURL; // Set the image URL
    
    container.appendChild(clone); // Append the cloned div to the container
    console.log(`Added image URL: ${imageURL}`); // Log the new addition
  });
}

// New function to handle checkbox toggle
function toggleCustomCheckbox() {
  const checkboxes = document.querySelectorAll('.popup-toggle-checkbox-83a1371d7');
  
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

// Function to only allow one Main Photo to be selected at a time
function allowSingleMainCheckbox() {
  const mainCheckboxes = document.querySelectorAll('input[data-type="main"]');
  
  mainCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        // Uncheck other checkboxes with data-type="main"
        mainCheckboxes.forEach((otherCheckbox) => {
          if (otherCheckbox !== this) {
            otherCheckbox.checked = false;
            otherCheckbox.previousElementSibling.classList.remove('checked');
          }
        });
      }
    });
  });
}

// Function to toggle visibility based on the dropdown selection
function showHideForm() {
  // Fetch the selected value from the dropdown
  const selectedValue = document.getElementById('form-type').value;

  // Get the Race and Course form elements
  const raceForm = document.getElementById('race-details-form');
  const courseForm = document.getElementById('course-details-form');

  // Remove any existing 'hidden' classes first
  raceForm.classList.remove('hidden');
  courseForm.classList.remove('hidden');
  
  // Apply the 'hidden' class based on the selected value
  if (selectedValue === 'race') {
      courseForm.classList.add('hidden');
  } else if (selectedValue === 'course') {
      raceForm.classList.add('hidden');
  }
  
  console.log(`Selected Value: ${selectedValue}`);
} 

// Function to handle displaying and logging the selected record ID
function handleSelectedRecordID(raceNameDropdown, recordIdDisplay) {
  const selectedRecordID = raceNameDropdown.value;
  console.log("Retrieved selectedRecordID:", selectedRecordID);
  recordIdDisplay.textContent = selectedRecordID;
  console.log("Record ID has been displayed");
}

// Function to attach a listener to the race name dropdown
function attachRaceNameListener() {
  // Log the initialization of function
  console.log("attachRaceNameListener function initialized");

  // Get the dropdown element by its id
  const raceNameDropdown = document.getElementById('plugin-course-form-race-name');

  // Log if the raceNameDropdown was found or not
  if (raceNameDropdown) {
    console.log("Successfully retrieved raceNameDropdown element");
  } else {
    console.log("Failed to retrieve raceNameDropdown element");
    return; // Exit the function if the element isn't found
  }

  // Get the element where we want to display the record ID
  const recordIdDisplay = document.getElementById('record-id-83a1371d7');

  // Log if the recordIdDisplay was found or not
  if (recordIdDisplay) {
    console.log("Successfully retrieved recordIdDisplay element");
  } else {
    console.log("Failed to retrieve recordIdDisplay element");
    return; // Exit the function if the element isn't found
  }

  // Display the record ID immediately upon function call
  handleSelectedRecordID(raceNameDropdown, recordIdDisplay);

  // Attach an event listener to the dropdown
  raceNameDropdown.addEventListener('change', function() {
    // Log when a change is detected in dropdown
    console.log("Change detected in raceNameDropdown");

    // Handle the changed selectedRecordID
    handleSelectedRecordID(raceNameDropdown, recordIdDisplay);
  });

  // Log that the event listener has been attached
  console.log("Event listener attached to raceNameDropdown");
}

// Trigger the handleSelectedRecordID function on page load
window.addEventListener('load', function() {
  attachRaceNameListener();
});

// Function to toggle hidden class for additional sports div
function toggleAdditionalSportsVisibility() {
  // Log function initialization
  console.log("toggleAdditionalSportsVisibility function initialized");

  // Get the button element by its id
  const showMoreSportsButton = document.getElementById('plugin-show-more-sports-button-83a1371d7');

  // Log if the button was found or not
  if (showMoreSportsButton) {
    console.log("Successfully retrieved showMoreSportsButton element");
  } else {
    console.log("Failed to retrieve showMoreSportsButton element");
    return; // Exit the function if the element isn't found
  }

  // Get the div element where we want to toggle the hidden class
  const additionalSportsDiv = document.getElementById('plugin-course-form-additional-sports-83a1371d7');

  // Log if the div was found or not
  if (additionalSportsDiv) {
    console.log("Successfully retrieved additionalSportsDiv element");
  } else {
    console.log("Failed to retrieve additionalSportsDiv element");
    return; // Exit the function if the element isn't found
  }

  // Attach an event listener to the button
  showMoreSportsButton.addEventListener('click', function() {
    // Log when the button is clicked
    console.log("Show More Sports button clicked");

    // Toggle the 'hidden' class on the additionalSportsDiv
    additionalSportsDiv.classList.toggle('hidden');

    // Update the button text based on whether the div is hidden or not
    if (additionalSportsDiv.classList.contains('hidden')) {
      showMoreSportsButton.textContent = "Expand Sports";
      console.log("additionalSportsDiv is now hidden");
    } else {
      showMoreSportsButton.textContent = "Close Sports";
      console.log("additionalSportsDiv is now visible");
    }
  });

  // Log that the event listener has been attached
  console.log("Event listener attached to showMoreSportsButton");
}

// Function to attach event listener to the refresh button
function attachRefreshButtonListener(buttonID, containerID, templateDivID) {
  const refreshButton = document.getElementById(buttonID); // Get refresh button by ID

  // Attach event listener for click event
  refreshButton.addEventListener('click', function() {
    console.log("Refresh images button clicked"); // Log button click
    addImageAndCheckboxes(containerID, templateDivID); // Call the function to add images and checkboxes
    toggleCustomCheckbox();
    allowSingleMainCheckbox();
  });

  console.log("Event listener attached to refresh button"); // Log that the event listener has been attached
}

// Function to setup search suggestions
async function setupSearchSuggestions(searchInputId, suggestionsBoxId) {
  const searchInput = document.getElementById(searchInputId);
  const suggestionsBox = document.getElementById(suggestionsBoxId);

  // Log to confirm elements have been found
  if (searchInput) {
    console.log("Search Input element found.");
  } else {
    console.log("Search Input element not found.");
  }

  if (suggestionsBox) {
    console.log("Suggestions Box element found.");
  } else {
    console.log("Suggestions Box element not found.");
  }

  searchInput.addEventListener('input', async (e) => {
    console.log("Input event triggered."); // Log when input event is triggered
    const query = e.target.value.trim();

    if (query === "") {
      suggestionsBox.innerHTML = "";
      suggestionsBox.classList.remove('active');
      suggestionsBox.style.display = "none";
      console.log("Query is empty, suggestions hidden."); // Log empty query case
      return;
    }

    try {
      const response = await fetch(`https://treccy-serverside-magnus1000.vercel.app/api/mapBoxSearchSuggestions?q=${query}`);
      const data = await response.json();
      
      console.log("Data received:", data); // Log the data received

      if (data.suggestions && data.suggestions.length > 0) {
        suggestionsBox.classList.add('active');
        suggestionsBox.style.display = "flex";
        suggestionsBox.innerHTML = "";

        const suggestions = data.suggestions;
        console.log(`Found ${suggestions.length} suggestions.`); // Log number of suggestions found

        suggestions.forEach(suggestion => {
          const placeName = suggestion.place_name;
          const suggestionItem = document.createElement('div');
          suggestionItem.classList.add('plugin-suggestion-item-83a1371d7');

          const iconElement = document.createElement('i');
          iconElement.className = 'fa-light fa-location-dot';
          suggestionItem.appendChild(iconElement);

          suggestionItem.appendChild(document.createTextNode(placeName));
          suggestionsBox.appendChild(suggestionItem);

          suggestionItem.addEventListener('click', () => {
            searchInput.value = placeName;
            searchInput.setAttribute('data-lat', suggestion.coordinates[1]);
            searchInput.setAttribute('data-lon', suggestion.coordinates[0]);
            searchInput.setAttribute('data-region', suggestion.region || '');
            searchInput.setAttribute('data-city', suggestion.city || '');
            searchInput.setAttribute('data-country', suggestion.country || '');
            suggestionsBox.innerHTML = "";
            suggestionsBox.classList.remove('active');
            suggestionsBox.style.display = "none";
            
            console.log("Suggestion clicked and input filled."); // Log when suggestion is clicked
          });
        });
      } else {
        suggestionsBox.classList.remove('active');
        suggestionsBox.style.display = "none";
        console.log("No suggestions found."); // Log when no suggestions are available
      }
    } catch (error) {
      console.error("Error:", error); // Log any errors
      suggestionsBox.classList.remove('active');
      suggestionsBox.style.display = "none";
    }
  });
}

// Function to attach event listener to the sport toggle
function attachSportToggleListener() {  // Locate the checkbox element by its ID
  const checkbox = document.getElementById('drawer-toggle-checkbox-83a1371d7');

  // Check if the checkbox element exists
  if (checkbox) {
    // Attach a 'change' event listener to the checkbox
    checkbox.addEventListener('change', function(event) {
      // Log the new checked state of the checkbox to the console
      console.log(`Sport checkbox state is now: ${event.target.checked}`);
      toggleMultiSportDivs(event.target);
    });

    console.log('Event listener attached to sport toggle checkbox.');
  } else {
    console.log('Sport toggle checkbox not found. Make sure the ID is correct.');
  }
}

function toggleMultiSportDivs(checkboxElement) {
  // Log the beginning of the function execution
  console.log("Entering toggleMultiSportDivs function...");

  // Get all div elements with the custom attribute 'data-sport="multisport"'
  const multiSportDivs = document.querySelectorAll('div[data-sport="multisport"]');
  
  // Log the number of div elements found
  console.log(`Found ${multiSportDivs.length} div(s) with 'data-sport="multisport"' attribute.`);
  
  // Loop through each div element found
  multiSportDivs.forEach((div, index) => {
    // Log the current div element being processed
    console.log(`Processing div element ${index + 1}...`);
    
    if (checkboxElement.checked) {
      // If the checkbox is checked, add the "hidden" class
      div.classList.add('hidden');
      // Log that the "hidden" class was added
      console.log(`Added 'hidden' class to div element ${index + 1}.`);
    } else {
      // Otherwise, remove the "hidden" class
      div.classList.remove('hidden');
      // Log that the "hidden" class was removed
      console.log(`Removed 'hidden' class from div element ${index + 1}.`);
    }
  });

  // Log to the console the final outcome
  console.log(`Toggled the hidden class for multisport divs based on checkbox state: ${checkboxElement.checked ? 'hide' : 'show'}`);
  
  // Log the end of the function execution
  console.log("Exiting toggleMultiSportDivs function.");
}

// Function to populate form fields from saved state
function populateFormFields() {
  // Retrieve the stored form data from sessionStorage
  const formData = JSON.parse(sessionStorage.getItem('formData')) || {};

    // Populate checkboxes
    Object.keys(formData).forEach(function(key) {
      const element = document.getElementById(key);
      if (element && element.type === 'checkbox') {
        element.checked = formData[key];
      }
    });

    // Populate input fields
    Object.keys(formData).forEach(function(key) {
      const element = document.getElementById(key);
      if (element && 
        (element.type === 'text' || 
         element.type === 'email' || 
         element.type === 'date' || 
         element.type === 'time')) {
      element.value = formData[key];
    }
  });

    // Populate select fields
    Object.keys(formData).forEach(function(key) {
      const element = document.getElementById(key);
      if (element && element.tagName === 'SELECT') {
        element.value = formData[key];
      }
    });

    // Populate text areas
    Object.keys(formData).forEach(function(key) {
      const element = document.getElementById(key);
      if (element && element.tagName === 'TEXTAREA') {
        element.value = formData[key];
      }
    });

    console.log('Form fields populated from saved state:', formData);
}

// Function to save form field states
function saveFormFieldStates() {
  // Creating an object to hold form data
  let formData = {};

  // Save checkboxes
  document.querySelectorAll('input[type=checkbox]').forEach(function(checkbox) {
    formData[checkbox.id] = checkbox.checked;
  });

  // Save input fields
  document.querySelectorAll('input[type=text], input[type=email]').forEach(function(input) {
    formData[input.id] = input.value;
  });

  // Save select fields
  document.querySelectorAll('select').forEach(function(select) {
    formData[select.id] = select.value;
  });

  // Save text areas
  document.querySelectorAll('textarea').forEach(function(textarea) {
    formData[textarea.id] = textarea.value;
  });

  saveImageSetToSessionStorage();

  sessionStorage.setItem('formData', JSON.stringify(formData));
  console.log('Form field states saved:', formData);
}

// Function to attach event listeners for saving form field states
function attachFormStateListeners() {
  document.querySelectorAll('input[type=checkbox], input[type=text], input[type=email], input[type=date], input[type=time], select, textarea').forEach(function(element) {
    element.addEventListener('change', saveFormFieldStates);
  });
  console.log("Form state listeners attached.");
}

// Function to clear form data from sessionStorage and reset form fields
function clearFormData() {
  // Remove stored form data from sessionStorage
  sessionStorage.removeItem('formData');

  // Clear checkboxes
  document.querySelectorAll('input[type=checkbox]').forEach(function(checkbox) {
    checkbox.checked = false;
  });

  // Clear input fields
  document.querySelectorAll('input[type=text], input[type=email], input[type=date], input[type=time]').forEach(function(input) {
    input.value = '';
  });

  // Clear select fields
  document.querySelectorAll('select').forEach(function(select) {
    select.selectedIndex = 0;
  });

  // Clear text areas
  document.querySelectorAll('textarea').forEach(function(textarea) {
    textarea.value = '';
  });

  console.log('Form data cleared.');
}

function attachClearFormButtonRevealListener() {
  // Log to console that we are attaching the event listener
  console.log('Attaching listener to plugin-clear-form-83a1371d7');

  // Find the button element by its ID
  const clearFormButton = document.getElementById('plugin-clear-form-83a1371d7');

  // Check if the button element exists
  if (clearFormButton) {
    console.log('plugin-clear-form-83a1371d7 element found');

    // Attach a click event listener to the button
    clearFormButton.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('plugin-clear-form-83a1371d7 clicked');

      // Find the confirmation element by its ID
      const confirmationElement = document.getElementById('plugin-clear-form-confirmation-83a1371d7');

      // Check if the confirmation element exists
      if (confirmationElement) {
        // Slowly remove the 'hidden' class from the confirmation element
        setTimeout(() => {
          confirmationElement.classList.remove('hidden');
        }, 200);
      }

      // Apply the 'hidden' class to the button (itself)
      clearFormButton.classList.add('hidden');
    });
  } else {
    // Log an error message if the button is not found
    console.error('Element with ID = plugin-clear-form-83a1371d7 not found');
  }
}

// Function to attach event listener to the confirmation button
function attachClearFormConfirmationButtonListener() {
  console.log('Attaching listener to plugin-clear-form-confirmation-83a1371d7');

  // Find the confirmation button element by its ID
  const confirmationButton = document.getElementById('plugin-clear-form-confirmation-83a1371d7');

  // Check if the confirmation button element exists
  if (confirmationButton) {
    console.log('plugin-clear-form-confirmation-83a1371d7 element found');

    // Attach a click event listener to the confirmation button
    confirmationButton.addEventListener('click', (event) => {
      console.log('plugin-clear-form-confirmation-83a1371d7 clicked');
      event.preventDefault();

      // Call the clearFormData function
      clearFormData();

      // Add the 'hidden' class to the confirmation button itself
      confirmationButton.classList.add('hidden');

      // Find the original clear form button by its ID
      const originalClearFormButton = document.getElementById('plugin-clear-form-83a1371d7');

      // Check if the original clear form button exists
      if (originalClearFormButton) {
        // Remove the 'hidden' class from the original clear form button
        originalClearFormButton.classList.remove('hidden');
      }
    });
  } else {
    // Log an error message if the button is not found
    console.error('Element with ID = plugin-clear-form-confirmation-83a1371d7 not found');
  }
}

// Function to attach a keydown event listener to the document
function attachGlobalDropdownKeyListener() {
  console.log('Attaching global keydown listener');

  // Attach a keydown event listener to the document
  document.addEventListener('keydown', (event) => {
    console.log(`Key pressed: ${event.key}`);

    // Check if the target element is a select element
    if (event.target.tagName === 'SELECT') {
      // Get the select element from the event target
      const dropdown = event.target;

      // Log the ID of the select element
      console.log(`Dropdown ID: ${dropdown.id}`);

      // Check if the Delete or Backspace key was pressed
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Check if a placeholder option exists
        const placeholderExists = Array.from(dropdown.options).some(option => option.value === '');

        if (placeholderExists) {
          // Set the dropdown value to an empty string to select the placeholder
          dropdown.value = '';
          console.log('Dropdown reset to placeholder');
        } else {
          console.log('No placeholder found. Skipping reset.');
        }
      }
    }
  });
}


// Function to set required fields
function checkFormFields(formID, fieldIDs, maincheckboxType, gallerycheckboxType, createButtonID) {
const form = document.getElementById(formID);
const createButton = document.getElementById(createButtonID);

// Disable the button by default
createButton.disabled = true;
createButton.style.opacity = '0.5';

console.log("Initial button state: disabled");
console.log(`Number of required fields: ${fieldIDs.length}`);

// Listen for input events on the form
form.addEventListener('input', function () {
  let filledFields = 0;

  // Loop through each ID in the fieldIDs array
  fieldIDs.forEach(function (id) {
    const field = form.querySelector(`#${id}`);
    if (field && field.value) {
      filledFields++;
    }
  });

  let mainCheckboxCount = 0;
  let galleryCheckboxCount = 0;

  // Only check checkboxes if formID is 'race-details-form'
  if (formID === 'race-details-form') {
    const maincheckboxquery = `input[data-type="${maincheckboxType}"]:checked`;
    const gallerycheckboxquery = `input[data-type="${gallerycheckboxType}"]:checked`;

    const mainCheckboxes = document.querySelectorAll(maincheckboxquery);
    mainCheckboxCount = mainCheckboxes.length;

    const galleryCheckboxes = document.querySelectorAll(gallerycheckboxquery);
    galleryCheckboxCount = galleryCheckboxes.length;
  }

  // Final condition to enable or disable button
  let enableButton = false;

  if (formID === 'race-details-form') {
    enableButton = filledFields === fieldIDs.length && mainCheckboxCount === 1 && galleryCheckboxCount >= 1;
  } else {
    enableButton = filledFields === fieldIDs.length;
  }

  if (enableButton) {
    createButton.disabled = false;
    createButton.style.opacity = '1';
    console.log("Button state: enabled");
  } else {
    createButton.disabled = true;
    createButton.style.opacity = '0.5';
    console.log("Button state: disabled");
  }
});
}