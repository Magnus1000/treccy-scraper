console.log(`drawer.js script loaded at ${Date.now()} ms`);

document.addEventListener('DOMContentLoaded', () => {
  
  // Find the element with ID = expand-collapse
  const expandCollapseWrapper = document.getElementById('expand-collapse');

  // Check if the element exists
  if (expandCollapseWrapper) {
    
    // Add click event listener
    expandCollapseWrapper.addEventListener('click', () => {
      
      // Log to console for debugging
      console.log('expand-collapse-wrapper clicked');
      
      // Find the element with class = expand-collapse-wrapper
      const expandCollapseElement = document.querySelector('.expand-collapse-wrapper');
      
      // Find the element with class = drawer-wrapper
      const drawerWrapperElement = document.querySelector('.drawer-wrapper');

      // Toggle the "collapsed" class if the elements exist
      if (expandCollapseElement) {
        expandCollapseElement.classList.toggle('collapse');
      }
      
      if (drawerWrapperElement) {
        drawerWrapperElement.classList.toggle('collapse');
      }
    });
  } else {
    // Log error message to console if the element with the given ID is not found
    console.error('Element with ID = expand-collapse not found');
  }
}); 