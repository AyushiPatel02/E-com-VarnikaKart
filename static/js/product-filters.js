/**
 * Product Filters and Sorting for VarnikaKart
 * Enhanced product filtering and sorting functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize product filters
    initProductFilters();
    
    // Listen for theme changes to reinitialize
    document.addEventListener('themeChanged', function() {
        initProductFilters();
    });
    
    // Listen for dark mode changes to reinitialize
    document.addEventListener('darkModeChanged', function() {
        initProductFilters();
    });
});

/**
 * Initialize product filters
 */
function initProductFilters() {
    console.log('Initializing product filters');
    
    // Initialize filter sections
    initFilterSections();
    
    // Initialize price range slider
    initPriceRangeSlider();
    
    // Initialize color filters
    initColorFilters();
    
    // Initialize sorting options
    initSortingOptions();
    
    // Initialize view options
    initViewOptions();
    
    // Initialize filter tags
    initFilterTags();
    
    // Initialize mobile filter drawer
    initMobileFilterDrawer();
    
    // Initialize filter form submission
    initFilterFormSubmission();
}

/**
 * Initialize filter sections (collapsible)
 */
function initFilterSections() {
    // Get all filter section titles
    const sectionTitles = document.querySelectorAll('.filter-section-title');
    
    sectionTitles.forEach(title => {
        // Skip if already initialized
        if (title.getAttribute('data-filter-initialized')) return;
        
        // Mark as initialized
        title.setAttribute('data-filter-initialized', 'true');
        
        // Get section content
        const sectionContent = title.nextElementSibling;
        
        // Add click event listener
        title.addEventListener('click', function() {
            // Toggle collapsed class on title
            this.classList.toggle('collapsed');
            
            // Toggle collapsed class on content
            sectionContent.classList.toggle('collapsed');
        });
    });
}

/**
 * Initialize price range slider
 */
function initPriceRangeSlider() {
    // Get all price range sliders
    const priceRangeSliders = document.querySelectorAll('.price-range-slider');
    
    priceRangeSliders.forEach(slider => {
        // Skip if already initialized
        if (slider.getAttribute('data-slider-initialized')) return;
        
        // Mark as initialized
        slider.setAttribute('data-slider-initialized', 'true');
        
        // Get slider elements
        const progress = slider.querySelector('.price-range-progress');
        const minHandle = slider.querySelector('.price-range-handle.min');
        const maxHandle = slider.querySelector('.price-range-handle.max');
        const minValue = slider.parentElement.querySelector('.price-range-min');
        const maxValue = slider.parentElement.querySelector('.price-range-max');
        const minInput = slider.parentElement.querySelector('input[name="price_min"]');
        const maxInput = slider.parentElement.querySelector('input[name="price_max"]');
        
        // Get slider dimensions
        const sliderRect = slider.getBoundingClientRect();
        const sliderWidth = sliderRect.width;
        
        // Get min and max price values
        const minPrice = parseInt(minInput.getAttribute('min') || 0);
        const maxPrice = parseInt(maxInput.getAttribute('max') || 10000);
        
        // Set initial handle positions
        let minHandlePos = ((parseInt(minInput.value) - minPrice) / (maxPrice - minPrice)) * 100;
        let maxHandlePos = ((parseInt(maxInput.value) - minPrice) / (maxPrice - minPrice)) * 100;
        
        // Ensure valid positions
        minHandlePos = isNaN(minHandlePos) ? 0 : minHandlePos;
        maxHandlePos = isNaN(maxHandlePos) ? 100 : maxHandlePos;
        
        // Update handle positions
        minHandle.style.left = `${minHandlePos}%`;
        maxHandle.style.left = `${maxHandlePos}%`;
        
        // Update progress bar
        progress.style.left = `${minHandlePos}%`;
        progress.style.width = `${maxHandlePos - minHandlePos}%`;
        
        // Update value displays
        updatePriceValues(minValue, maxValue, minInput.value, maxInput.value);
        
        // Add event listeners for dragging min handle
        addDragListener(minHandle, function(newPos) {
            // Convert position to percentage
            let percentage = (newPos / sliderWidth) * 100;
            
            // Constrain to valid range (0-100%)
            percentage = Math.max(0, Math.min(percentage, maxHandlePos - 5));
            
            // Update handle position
            minHandle.style.left = `${percentage}%`;
            
            // Update progress bar
            progress.style.left = `${percentage}%`;
            progress.style.width = `${maxHandlePos - percentage}%`;
            
            // Calculate new price value
            const newPrice = Math.round(((percentage / 100) * (maxPrice - minPrice)) + minPrice);
            
            // Update input value
            minInput.value = newPrice;
            
            // Update value display
            updatePriceValues(minValue, maxValue, newPrice, maxInput.value);
        });
        
        // Add event listeners for dragging max handle
        addDragListener(maxHandle, function(newPos) {
            // Convert position to percentage
            let percentage = (newPos / sliderWidth) * 100;
            
            // Constrain to valid range (0-100%)
            percentage = Math.max(minHandlePos + 5, Math.min(percentage, 100));
            
            // Update handle position
            maxHandle.style.left = `${percentage}%`;
            
            // Update progress bar
            progress.style.width = `${percentage - minHandlePos}%`;
            
            // Calculate new price value
            const newPrice = Math.round(((percentage / 100) * (maxPrice - minPrice)) + minPrice);
            
            // Update input value
            maxInput.value = newPrice;
            
            // Update value display
            updatePriceValues(minValue, maxValue, minInput.value, newPrice);
        });
    });
}

/**
 * Add drag listener to an element
 * @param {Element} element - The element to make draggable
 * @param {Function} callback - Callback function with new position
 */
function addDragListener(element, callback) {
    let isDragging = false;
    let startX, startLeft;
    
    // Mouse events
    element.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch events
    element.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
        isDragging = true;
        
        // Get starting position
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        startLeft = element.offsetLeft;
        
        // Prevent default to avoid text selection
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        // Get current position
        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - startX;
        
        // Calculate new position
        const newLeft = startLeft + deltaX;
        
        // Call callback with new position
        callback(newLeft);
    }
    
    function endDrag() {
        isDragging = false;
    }
}

/**
 * Update price range values
 * @param {Element} minElement - Min price display element
 * @param {Element} maxElement - Max price display element
 * @param {number} minPrice - Min price value
 * @param {number} maxPrice - Max price value
 */
function updatePriceValues(minElement, maxElement, minPrice, maxPrice) {
    // Format price with currency symbol
    const formattedMinPrice = formatPrice(minPrice);
    const formattedMaxPrice = formatPrice(maxPrice);
    
    // Update display elements
    minElement.textContent = formattedMinPrice;
    maxElement.textContent = formattedMaxPrice;
}

/**
 * Format price with currency symbol
 * @param {number} price - The price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    return '₹' + parseInt(price).toLocaleString('en-IN');
}

/**
 * Initialize color filters
 */
function initColorFilters() {
    // Get all color filter options
    const colorOptions = document.querySelectorAll('.filter-color');
    
    colorOptions.forEach(option => {
        // Skip if already initialized
        if (option.getAttribute('data-color-initialized')) return;
        
        // Mark as initialized
        option.setAttribute('data-color-initialized', 'true');
        
        // Get color value
        const colorValue = option.getAttribute('data-color');
        
        // Set background color
        option.style.backgroundColor = colorValue;
        
        // Add click event listener
        option.addEventListener('click', function() {
            // Toggle selected class
            this.classList.toggle('selected');
            
            // Get hidden input
            const input = document.querySelector(`input[name="color"][value="${colorValue}"]`);
            
            if (input) {
                // Toggle checked state
                input.checked = this.classList.contains('selected');
            }
        });
        
        // Check if should be selected initially
        const input = document.querySelector(`input[name="color"][value="${colorValue}"]`);
        if (input && input.checked) {
            option.classList.add('selected');
        }
    });
}

/**
 * Initialize sorting options
 */
function initSortingOptions() {
    // Get sorting select element
    const sortingSelect = document.querySelector('.sorting-select');
    
    if (sortingSelect) {
        // Skip if already initialized
        if (sortingSelect.getAttribute('data-sorting-initialized')) return;
        
        // Mark as initialized
        sortingSelect.setAttribute('data-sorting-initialized', 'true');
        
        // Add change event listener
        sortingSelect.addEventListener('change', function() {
            // Get sort value
            const sortValue = this.value;
            
            // Get sort input
            const sortInput = document.querySelector('input[name="sort"]');
            
            if (sortInput) {
                // Update sort input value
                sortInput.value = sortValue;
                
                // Submit form
                const form = sortInput.closest('form');
                if (form) {
                    form.submit();
                }
            }
        });
    }
}

/**
 * Initialize view options
 */
function initViewOptions() {
    // Get view option buttons
    const viewOptions = document.querySelectorAll('.view-option');
    
    viewOptions.forEach(option => {
        // Skip if already initialized
        if (option.getAttribute('data-view-initialized')) return;
        
        // Mark as initialized
        option.setAttribute('data-view-initialized', 'true');
        
        // Add click event listener
        option.addEventListener('click', function() {
            // Remove active class from all options
            viewOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get view value
            const viewValue = this.getAttribute('data-view');
            
            // Get products container
            const productsContainer = document.querySelector('.products-container');
            
            if (productsContainer) {
                // Remove all view classes
                productsContainer.classList.remove('grid-view', 'list-view', 'compact-view');
                
                // Add selected view class
                productsContainer.classList.add(`${viewValue}-view`);
                
                // Save preference in localStorage
                localStorage.setItem('varnikakart-view-preference', viewValue);
            }
        });
    });
    
    // Load saved view preference
    const savedView = localStorage.getItem('varnikakart-view-preference');
    if (savedView) {
        // Find option with saved view
        const option = document.querySelector(`.view-option[data-view="${savedView}"]`);
        if (option) {
            // Trigger click event
            option.click();
        }
    }
}

/**
 * Initialize filter tags
 */
function initFilterTags() {
    // Get all filter tags
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        // Skip if already initialized
        if (tag.getAttribute('data-tag-initialized')) return;
        
        // Mark as initialized
        tag.setAttribute('data-tag-initialized', 'true');
        
        // Get remove button
        const removeButton = tag.querySelector('.filter-tag-remove');
        
        if (removeButton) {
            // Add click event listener
            removeButton.addEventListener('click', function() {
                // Get filter name and value
                const filterName = tag.getAttribute('data-filter-name');
                const filterValue = tag.getAttribute('data-filter-value');
                
                // Find corresponding input
                let input;
                
                if (filterName === 'price') {
                    // Handle price range
                    const minInput = document.querySelector('input[name="price_min"]');
                    const maxInput = document.querySelector('input[name="price_max"]');
                    
                    if (minInput) minInput.value = minInput.getAttribute('min') || 0;
                    if (maxInput) maxInput.value = maxInput.getAttribute('max') || 10000;
                    
                    // Reinitialize price slider
                    initPriceRangeSlider();
                } else if (filterName === 'color') {
                    // Handle color filter
                    input = document.querySelector(`input[name="color"][value="${filterValue}"]`);
                    
                    // Unselect color option
                    const colorOption = document.querySelector(`.filter-color[data-color="${filterValue}"]`);
                    if (colorOption) {
                        colorOption.classList.remove('selected');
                    }
                } else {
                    // Handle checkbox filters
                    input = document.querySelector(`input[name="${filterName}"][value="${filterValue}"]`);
                }
                
                if (input) {
                    // Uncheck input
                    input.checked = false;
                }
                
                // Remove tag
                tag.remove();
                
                // Submit form
                const form = document.querySelector('.filter-form');
                if (form) {
                    form.submit();
                }
            });
        }
    });
}

/**
 * Initialize mobile filter drawer
 */
function initMobileFilterDrawer() {
    // Get mobile filter toggle button
    const filterToggle = document.querySelector('.mobile-filter-toggle');
    
    if (filterToggle) {
        // Skip if already initialized
        if (filterToggle.getAttribute('data-mobile-initialized')) return;
        
        // Mark as initialized
        filterToggle.setAttribute('data-mobile-initialized', 'true');
        
        // Get filter drawer
        const filterDrawer = document.querySelector('.mobile-filter-drawer');
        
        if (filterDrawer) {
            // Add click event listener to toggle button
            filterToggle.addEventListener('click', function() {
                // Show filter drawer
                filterDrawer.classList.add('show');
                
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
            });
            
            // Get close button
            const closeButton = filterDrawer.querySelector('.mobile-filter-close');
            
            if (closeButton) {
                // Add click event listener to close button
                closeButton.addEventListener('click', function() {
                    // Hide filter drawer
                    filterDrawer.classList.remove('show');
                    
                    // Allow body scrolling
                    document.body.style.overflow = '';
                });
            }
            
            // Add click event listener to backdrop
            filterDrawer.addEventListener('click', function(e) {
                // Close drawer if clicking on backdrop
                if (e.target === filterDrawer) {
                    // Hide filter drawer
                    filterDrawer.classList.remove('show');
                    
                    // Allow body scrolling
                    document.body.style.overflow = '';
                }
            });
        }
    }
}

/**
 * Initialize filter form submission
 */
function initFilterFormSubmission() {
    // Get filter form
    const filterForm = document.querySelector('.filter-form');
    
    if (filterForm) {
        // Skip if already initialized
        if (filterForm.getAttribute('data-form-initialized')) return;
        
        // Mark as initialized
        filterForm.setAttribute('data-form-initialized', 'true');
        
        // Get apply button
        const applyButton = filterForm.querySelector('.filter-apply');
        
        if (applyButton) {
            // Add click event listener
            applyButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Submit form
                filterForm.submit();
            });
        }
        
        // Get clear button
        const clearButton = filterForm.querySelector('.filter-clear');
        
        if (clearButton) {
            // Add click event listener
            clearButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Reset all inputs
                const inputs = filterForm.querySelectorAll('input[type="checkbox"], input[type="radio"]');
                inputs.forEach(input => {
                    input.checked = false;
                });
                
                // Reset price range
                const minInput = filterForm.querySelector('input[name="price_min"]');
                const maxInput = filterForm.querySelector('input[name="price_max"]');
                
                if (minInput) minInput.value = minInput.getAttribute('min') || 0;
                if (maxInput) maxInput.value = maxInput.getAttribute('max') || 10000;
                
                // Reinitialize price slider
                initPriceRangeSlider();
                
                // Reset color filters
                const colorOptions = filterForm.querySelectorAll('.filter-color');
                colorOptions.forEach(option => {
                    option.classList.remove('selected');
                });
                
                // Submit form
                filterForm.submit();
            });
        }
    }
}
