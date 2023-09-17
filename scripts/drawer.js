// Listen for DOMContentLoaded event to make sure all elements are loaded
document.addEventListener('DOMContentLoaded', () => {
  
    // Find the element with ID = expand-collapse-wrapper
    const expandCollapseWrapper = document.getElementById('expand-collapse-wrapper');
  
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
          expandCollapseElement.classList.toggle('collapsed');
        }
        
        if (drawerWrapperElement) {
          drawerWrapperElement.classList.toggle('collapsed');
        }
      });
    } else {
      // Log error message to console if the element with the given ID is not found
      console.error('Element with ID = expand-collapse-wrapper not found');
    }
  });