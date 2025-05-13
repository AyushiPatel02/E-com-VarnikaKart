/**
 * Advanced Search Functionality for VarnikaKart
 * Enhanced search experience with autocomplete and filters
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced search
    initAdvancedSearch();
    
    // Listen for theme changes to reinitialize
    document.addEventListener('themeChanged', function() {
        initAdvancedSearch();
    });
    
    // Listen for dark mode changes to reinitialize
    document.addEventListener('darkModeChanged', function() {
        initAdvancedSearch();
    });
});

/**
 * Initialize advanced search functionality
 */
function initAdvancedSearch() {
    console.log('Initializing advanced search');
    
    // Initialize search autocomplete
    initSearchAutocomplete();
    
    // Initialize voice search
    initVoiceSearch();
    
    // Initialize search filters
    initSearchFilters();
    
    // Initialize recent searches
    initRecentSearches();
    
    // Initialize search analytics
    initSearchAnalytics();
}

/**
 * Initialize search autocomplete
 */
function initSearchAutocomplete() {
    // Get search input elements
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        // Skip if already initialized
        if (input.getAttribute('data-autocomplete-initialized')) return;
        
        // Mark as initialized
        input.setAttribute('data-autocomplete-initialized', 'true');
        
        // Create autocomplete container if it doesn't exist
        let autocompleteContainer = input.parentElement.querySelector('.search-autocomplete');
        
        if (!autocompleteContainer) {
            autocompleteContainer = document.createElement('div');
            autocompleteContainer.className = 'search-autocomplete';
            input.parentElement.appendChild(autocompleteContainer);
        }
        
        // Add input event listener
        input.addEventListener('input', debounce(function() {
            const query = this.value.trim();
            
            if (query.length >= 2) {
                // Show loading state
                showAutocompleteLoading(autocompleteContainer);
                
                // Fetch search suggestions
                fetchSearchSuggestions(query)
                    .then(suggestions => {
                        // Update autocomplete container
                        updateAutocompleteResults(autocompleteContainer, suggestions, query);
                        
                        // Show autocomplete
                        autocompleteContainer.classList.add('show');
                    })
                    .catch(error => {
                        console.error('Error fetching search suggestions:', error);
                        autocompleteContainer.classList.remove('show');
                    });
            } else {
                // Show recent and popular searches
                showRecentAndPopularSearches(autocompleteContainer);
                
                // Show autocomplete if there are recent or popular searches
                if (autocompleteContainer.children.length > 0) {
                    autocompleteContainer.classList.add('show');
                } else {
                    autocompleteContainer.classList.remove('show');
                }
            }
        }, 300));
        
        // Add focus event listener
        input.addEventListener('focus', function() {
            const query = this.value.trim();
            
            if (query.length < 2) {
                // Show recent and popular searches
                showRecentAndPopularSearches(autocompleteContainer);
                
                // Show autocomplete if there are recent or popular searches
                if (autocompleteContainer.children.length > 0) {
                    autocompleteContainer.classList.add('show');
                }
            }
        });
        
        // Add blur event listener
        input.addEventListener('blur', function() {
            // Hide autocomplete after a short delay
            setTimeout(() => {
                autocompleteContainer.classList.remove('show');
            }, 200);
        });
        
        // Add keydown event listener for navigation
        input.addEventListener('keydown', function(e) {
            // Skip if autocomplete is not visible
            if (!autocompleteContainer.classList.contains('show')) return;
            
            const items = autocompleteContainer.querySelectorAll('.autocomplete-item');
            const activeItem = autocompleteContainer.querySelector('.autocomplete-item.active');
            
            // Down arrow
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                
                if (!activeItem) {
                    // Activate first item
                    items[0]?.classList.add('active');
                } else {
                    // Find current index
                    const currentIndex = Array.from(items).indexOf(activeItem);
                    
                    // Deactivate current item
                    activeItem.classList.remove('active');
                    
                    // Activate next item or first item if at end
                    const nextIndex = (currentIndex + 1) % items.length;
                    items[nextIndex]?.classList.add('active');
                }
            }
            
            // Up arrow
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                
                if (!activeItem) {
                    // Activate last item
                    items[items.length - 1]?.classList.add('active');
                } else {
                    // Find current index
                    const currentIndex = Array.from(items).indexOf(activeItem);
                    
                    // Deactivate current item
                    activeItem.classList.remove('active');
                    
                    // Activate previous item or last item if at beginning
                    const prevIndex = (currentIndex - 1 + items.length) % items.length;
                    items[prevIndex]?.classList.add('active');
                }
            }
            
            // Enter key
            else if (e.key === 'Enter') {
                if (activeItem) {
                    e.preventDefault();
                    
                    // Click active item
                    activeItem.click();
                }
            }
            
            // Escape key
            else if (e.key === 'Escape') {
                e.preventDefault();
                
                // Hide autocomplete
                autocompleteContainer.classList.remove('show');
            }
        });
    });
}

/**
 * Show loading state in autocomplete container
 * @param {Element} container - The autocomplete container
 */
function showAutocompleteLoading(container) {
    container.innerHTML = `
        <div class="autocomplete-section">
            <div class="loading-spinner loading-spinner-sm"></div>
        </div>
    `;
}

/**
 * Show recent and popular searches in autocomplete container
 * @param {Element} container - The autocomplete container
 */
function showRecentAndPopularSearches(container) {
    // Get recent searches from localStorage
    const recentSearches = getRecentSearches();
    
    // Popular searches (in a real app, these would come from the backend)
    const popularSearches = [
        'Handmade Pottery',
        'Wooden Crafts',
        'Embroidered Textiles',
        'Handwoven Baskets',
        'Brass Sculptures'
    ];
    
    // Clear container
    container.innerHTML = '';
    
    // Add recent searches section if there are any
    if (recentSearches.length > 0) {
        const recentSection = document.createElement('div');
        recentSection.className = 'autocomplete-section';
        recentSection.innerHTML = `
            <div class="autocomplete-section-title">Recent Searches</div>
            <div class="recent-searches"></div>
        `;
        
        const recentSearchesContainer = recentSection.querySelector('.recent-searches');
        
        recentSearches.forEach(search => {
            const recentSearch = document.createElement('div');
            recentSearch.className = 'recent-search';
            recentSearch.innerHTML = `<i class="fas fa-history"></i> ${search}`;
            
            recentSearch.addEventListener('click', function() {
                // Set search input value
                const searchInput = container.parentElement.querySelector('.search-input');
                searchInput.value = search;
                
                // Submit search form
                const searchForm = searchInput.closest('form');
                if (searchForm) {
                    searchForm.submit();
                }
            });
            
            recentSearchesContainer.appendChild(recentSearch);
        });
        
        container.appendChild(recentSection);
    }
    
    // Add popular searches section
    const popularSection = document.createElement('div');
    popularSection.className = 'autocomplete-section';
    popularSection.innerHTML = `
        <div class="autocomplete-section-title">Popular Searches</div>
        <div class="popular-searches"></div>
    `;
    
    const popularSearchesContainer = popularSection.querySelector('.popular-searches');
    
    popularSearches.forEach(search => {
        const popularSearch = document.createElement('div');
        popularSearch.className = 'popular-search';
        popularSearch.innerHTML = `<i class="fas fa-fire"></i> ${search}`;
        
        popularSearch.addEventListener('click', function() {
            // Set search input value
            const searchInput = container.parentElement.querySelector('.search-input');
            searchInput.value = search;
            
            // Submit search form
            const searchForm = searchInput.closest('form');
            if (searchForm) {
                searchForm.submit();
            }
        });
        
        popularSearchesContainer.appendChild(popularSearch);
    });
    
    container.appendChild(popularSection);
}

/**
 * Update autocomplete results
 * @param {Element} container - The autocomplete container
 * @param {Array} suggestions - The search suggestions
 * @param {string} query - The search query
 */
function updateAutocompleteResults(container, suggestions, query) {
    // Clear container
    container.innerHTML = '';
    
    // If no suggestions, show no results message
    if (suggestions.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No results found for "${query}"</p>
            </div>
        `;
        return;
    }
    
    // Group suggestions by category
    const groupedSuggestions = groupSuggestionsByCategory(suggestions);
    
    // Add each category section
    Object.keys(groupedSuggestions).forEach(category => {
        const categoryItems = groupedSuggestions[category];
        
        const section = document.createElement('div');
        section.className = 'autocomplete-section';
        section.innerHTML = `
            <div class="autocomplete-section-title">${category}</div>
            <div class="autocomplete-items"></div>
        `;
        
        const itemsContainer = section.querySelector('.autocomplete-items');
        
        // Add each item
        categoryItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'autocomplete-item';
            
            // Create item HTML
            itemElement.innerHTML = `
                <div class="autocomplete-item-image">
                    <img src="${item.image || '/static/img/placeholder.jpg'}" alt="${item.title}">
                </div>
                <div class="autocomplete-item-content">
                    <div class="autocomplete-item-title">${highlightQuery(item.title, query)}</div>
                    <div class="autocomplete-item-category">${item.category}</div>
                </div>
                <div class="autocomplete-item-price">₹${item.price}</div>
            `;
            
            // Add click event
            itemElement.addEventListener('click', function() {
                // Add to recent searches
                addToRecentSearches(item.title);
                
                // Navigate to product page
                window.location.href = item.url;
            });
            
            itemsContainer.appendChild(itemElement);
        });
        
        container.appendChild(section);
    });
}

/**
 * Group suggestions by category
 * @param {Array} suggestions - The search suggestions
 * @returns {Object} Grouped suggestions
 */
function groupSuggestionsByCategory(suggestions) {
    const grouped = {};
    
    suggestions.forEach(suggestion => {
        const category = suggestion.category || 'Products';
        
        if (!grouped[category]) {
            grouped[category] = [];
        }
        
        grouped[category].push(suggestion);
    });
    
    return grouped;
}

/**
 * Highlight query in text
 * @param {string} text - The text to highlight
 * @param {string} query - The query to highlight
 * @returns {string} Highlighted text
 */
function highlightQuery(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * Initialize voice search
 */
function initVoiceSearch() {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Browser does not support speech recognition');
        return;
    }
    
    // Get voice search buttons
    const voiceButtons = document.querySelectorAll('.search-voice');
    
    voiceButtons.forEach(button => {
        // Skip if already initialized
        if (button.getAttribute('data-voice-initialized')) return;
        
        // Mark as initialized
        button.setAttribute('data-voice-initialized', 'true');
        
        // Create speech recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // Configure recognition
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Set language
        
        // Add click event listener
        button.addEventListener('click', function() {
            // Get search input
            const searchInput = this.parentElement.querySelector('.search-input');
            
            // Toggle listening state
            if (this.classList.contains('listening')) {
                recognition.stop();
            } else {
                this.classList.add('listening');
                recognition.start();
            }
        });
        
        // Add result event listener
        recognition.onresult = function(event) {
            const searchInput = button.parentElement.querySelector('.search-input');
            const transcript = event.results[0][0].transcript;
            
            // Set search input value
            searchInput.value = transcript;
            
            // Trigger input event to show autocomplete
            searchInput.dispatchEvent(new Event('input'));
        };
        
        // Add end event listener
        recognition.onend = function() {
            button.classList.remove('listening');
        };
        
        // Add error event listener
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            button.classList.remove('listening');
        };
    });
}

/**
 * Initialize search filters
 */
function initSearchFilters() {
    // Get filter toggle buttons
    const filterToggles = document.querySelectorAll('.filters-toggle');
    
    filterToggles.forEach(toggle => {
        // Skip if already initialized
        if (toggle.getAttribute('data-filters-initialized')) return;
        
        // Mark as initialized
        toggle.setAttribute('data-filters-initialized', 'true');
        
        // Get filters content
        const filtersContent = toggle.closest('.search-filters').querySelector('.filters-content');
        
        // Add click event listener
        toggle.addEventListener('click', function() {
            // Toggle filters content
            filtersContent.style.display = filtersContent.style.display === 'none' ? 'grid' : 'none';
            
            // Update toggle text
            this.textContent = filtersContent.style.display === 'none' ? 'Show Filters' : 'Hide Filters';
        });
    });
    
    // Initialize range filters
    initRangeFilters();
    
    // Initialize checkbox filters
    initCheckboxFilters();
}

/**
 * Initialize range filters
 */
function initRangeFilters() {
    // Get range inputs
    const rangeInputs = document.querySelectorAll('.filter-range input');
    
    rangeInputs.forEach(input => {
        // Skip if already initialized
        if (input.getAttribute('data-range-initialized')) return;
        
        // Mark as initialized
        input.setAttribute('data-range-initialized', 'true');
        
        // Add input event listener
        input.addEventListener('input', function() {
            // Get min and max inputs
            const minInput = this.parentElement.querySelector('input[name*="min"]');
            const maxInput = this.parentElement.querySelector('input[name*="max"]');
            
            // Validate min and max values
            if (minInput && maxInput) {
                const minValue = parseInt(minInput.value) || 0;
                const maxValue = parseInt(maxInput.value) || 0;
                
                // Ensure min is not greater than max
                if (minValue > maxValue && maxValue > 0) {
                    if (this === minInput) {
                        minInput.value = maxValue;
                    } else {
                        maxInput.value = minValue;
                    }
                }
            }
        });
    });
}

/**
 * Initialize checkbox filters
 */
function initCheckboxFilters() {
    // Get checkbox inputs
    const checkboxInputs = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    
    checkboxInputs.forEach(input => {
        // Skip if already initialized
        if (input.getAttribute('data-checkbox-initialized')) return;
        
        // Mark as initialized
        input.setAttribute('data-checkbox-initialized', 'true');
        
        // Add change event listener
        input.addEventListener('change', function() {
            // Get all checkboxes in the same group
            const groupName = this.name.replace('[]', '');
            const groupCheckboxes = document.querySelectorAll(`input[name="${this.name}"]`);
            
            // Check if "All" checkbox
            if (this.value === 'all') {
                // If "All" is checked, uncheck others
                if (this.checked) {
                    groupCheckboxes.forEach(checkbox => {
                        if (checkbox !== this) {
                            checkbox.checked = false;
                        }
                    });
                }
            } else {
                // If any other checkbox is checked, uncheck "All"
                const allCheckbox = document.querySelector(`input[name="${this.name}"][value="all"]`);
                if (allCheckbox) {
                    allCheckbox.checked = false;
                }
                
                // If no checkboxes are checked, check "All"
                const checkedCount = Array.from(groupCheckboxes).filter(checkbox => checkbox.checked).length;
                if (checkedCount === 0 && allCheckbox) {
                    allCheckbox.checked = true;
                }
            }
        });
    });
}

/**
 * Initialize recent searches
 */
function initRecentSearches() {
    // Get recent searches from localStorage
    const recentSearches = getRecentSearches();
    
    // Get search forms
    const searchForms = document.querySelectorAll('form[role="search"]');
    
    searchForms.forEach(form => {
        // Skip if already initialized
        if (form.getAttribute('data-recent-initialized')) return;
        
        // Mark as initialized
        form.setAttribute('data-recent-initialized', 'true');
        
        // Add submit event listener
        form.addEventListener('submit', function(e) {
            // Get search input
            const searchInput = this.querySelector('.search-input');
            
            if (searchInput) {
                const query = searchInput.value.trim();
                
                // Add to recent searches if not empty
                if (query) {
                    addToRecentSearches(query);
                }
            }
        });
    });
}

/**
 * Get recent searches from localStorage
 * @returns {Array} Recent searches
 */
function getRecentSearches() {
    try {
        const searches = localStorage.getItem('varnikakart-recent-searches');
        return searches ? JSON.parse(searches) : [];
    } catch (error) {
        console.error('Error getting recent searches:', error);
        return [];
    }
}

/**
 * Add search query to recent searches
 * @param {string} query - The search query
 */
function addToRecentSearches(query) {
    try {
        // Get current recent searches
        let recentSearches = getRecentSearches();
        
        // Remove query if it already exists
        recentSearches = recentSearches.filter(search => search.toLowerCase() !== query.toLowerCase());
        
        // Add query to beginning
        recentSearches.unshift(query);
        
        // Limit to 5 recent searches
        recentSearches = recentSearches.slice(0, 5);
        
        // Save to localStorage
        localStorage.setItem('varnikakart-recent-searches', JSON.stringify(recentSearches));
    } catch (error) {
        console.error('Error adding to recent searches:', error);
    }
}

/**
 * Initialize search analytics
 */
function initSearchAnalytics() {
    // Get search forms
    const searchForms = document.querySelectorAll('form[role="search"]');
    
    searchForms.forEach(form => {
        // Skip if already initialized
        if (form.getAttribute('data-analytics-initialized')) return;
        
        // Mark as initialized
        form.setAttribute('data-analytics-initialized', 'true');
        
        // Add submit event listener
        form.addEventListener('submit', function() {
            // Get search input
            const searchInput = this.querySelector('.search-input');
            
            if (searchInput) {
                const query = searchInput.value.trim();
                
                // Track search event
                trackSearchEvent(query);
            }
        });
    });
}

/**
 * Track search event
 * @param {string} query - The search query
 */
function trackSearchEvent(query) {
    // In a real app, this would send data to an analytics service
    console.log('Search event:', query);
    
    // Example of sending to a backend API
    // fetch('/api/analytics/search', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ query })
    // });
}

/**
 * Fetch search suggestions from API
 * @param {string} query - The search query
 * @returns {Promise} Promise that resolves to search suggestions
 */
function fetchSearchSuggestions(query) {
    // In a real app, this would fetch from a backend API
    // return fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
    //     .then(response => response.json());
    
    // For demo purposes, return mock data
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    title: 'Handmade Pottery Bowl',
                    category: 'Pottery',
                    price: '1,200',
                    image: '/static/img/products/pottery-bowl.jpg',
                    url: '/product/handmade-pottery-bowl/'
                },
                {
                    title: 'Ceramic Vase',
                    category: 'Pottery',
                    price: '1,500',
                    image: '/static/img/products/ceramic-vase.jpg',
                    url: '/product/ceramic-vase/'
                },
                {
                    title: 'Wooden Handicraft Box',
                    category: 'Wooden Crafts',
                    price: '800',
                    image: '/static/img/products/wooden-box.jpg',
                    url: '/product/wooden-handicraft-box/'
                },
                {
                    title: 'Embroidered Wall Hanging',
                    category: 'Textiles',
                    price: '1,800',
                    image: '/static/img/products/wall-hanging.jpg',
                    url: '/product/embroidered-wall-hanging/'
                }
            ].filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
            ));
        }, 500);
    });
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    
    return function() {
        const context = this;
        const args = arguments;
        
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}
