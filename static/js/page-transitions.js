/**
 * Page Transitions for VarnikaKart
 * Handles smooth transitions between pages and loading states
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page transition system
    initPageTransitions();

    // Note: Initial loading is now handled by preloader.js
    // This file now focuses on transitions between pages after initial load
});

/**
 * Initialize page transition system
 */
function initPageTransitions() {
    // Add event listeners to all links for page transitions
    document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"]):not([href^="mailto:"]):not([href^="tel:"])').forEach(link => {
        // Check if the link already has a click handler for transitions
        if (link.getAttribute('data-has-transition-handler') === 'true') {
            return;
        }

        link.setAttribute('data-has-transition-handler', 'true');

        link.addEventListener('click', function(e) {
            // Skip if modifier keys are pressed
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            // Skip if it's an external link
            if (this.hostname !== window.location.hostname) return;

            // Skip if it's a dropdown toggle
            if (this.getAttribute('data-bs-toggle') === 'dropdown') return;

            // Skip if it's a tab toggle
            if (this.getAttribute('data-bs-toggle') === 'tab') return;

            // Skip if it's a modal toggle
            if (this.getAttribute('data-bs-toggle') === 'modal') return;

            // Get the href attribute
            const href = this.getAttribute('href');

            // Skip if href is empty or undefined
            if (!href) return;

            // Show transition overlay
            e.preventDefault();

            // Log navigation for debugging
            console.log('Page transitions: Navigating to:', href);

            // Use preloader.js showPreloader if available, otherwise use local function
            if (window.preloaderFunctions && typeof window.preloaderFunctions.showPreloader === 'function') {
                window.preloaderFunctions.showPreloader();
            } else {
                showPageTransitionOverlay();
            }

            // Navigate after a delay to ensure preloader is visible
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });

    // Add event listeners to forms for page transitions
    document.querySelectorAll('form:not([target="_blank"])').forEach(form => {
        // Check if the form already has a submit handler for transitions
        if (form.getAttribute('data-has-transition-handler') === 'true') {
            return;
        }

        form.setAttribute('data-has-transition-handler', 'true');

        form.addEventListener('submit', function(e) {
            // Skip AJAX forms
            if (this.dataset.ajax === 'true') return;

            // Skip search forms with empty input
            if (this.querySelector('input[type="search"]')) {
                const searchInput = this.querySelector('input[type="search"]');
                if (!searchInput.value.trim()) {
                    return;
                }
            }

            // Log form submission for debugging
            console.log('Form submission with transition');

            // Show transition overlay
            if (window.preloaderFunctions && typeof window.preloaderFunctions.showPreloader === 'function') {
                window.preloaderFunctions.showPreloader();
            } else {
                showPageTransitionOverlay();
            }
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        if (window.preloaderFunctions && typeof window.preloaderFunctions.showPreloader === 'function') {
            window.preloaderFunctions.showPreloader();
            setTimeout(() => {
                window.preloaderFunctions.hidePreloader();
            }, 800);
        } else {
            showPageTransitionOverlay();
            setTimeout(() => {
                hidePageTransitionOverlay();
            }, 800);
        }
    });
}

/**
 * Show page transition overlay
 */
function showPageTransitionOverlay() {
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        // Reset progress bar
        resetLoadingProgress();

        // Show overlay
        overlay.classList.add('active');

        // Update loading message
        updateLoadingMessage('Preparing your page...');
    }
}

/**
 * Hide page transition overlay
 */
function hidePageTransitionOverlay() {
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        // Ensure progress bar completes
        completeLoadingProgress();

        // Update loading message
        updateLoadingMessage('Almost there...');

        // Add a small delay to ensure content is loaded
        setTimeout(() => {
            // Fade out overlay
            overlay.classList.remove('active');

            // Apply fade-in animation to main content
            applyContentFadeIn();
        }, 500);
    }
}

/**
 * Show page loading progress
 */
function showPageLoadingProgress() {
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        // Reset progress bar
        resetLoadingProgress();

        // Show overlay
        overlay.classList.add('active');

        // Update loading message based on page
        const pageName = getPageName();
        updateLoadingMessage(`Loading ${pageName}...`);

        // Track loading progress
        trackLoadingProgress();
    }
}

/**
 * Reset loading progress bar
 */
function resetLoadingProgress() {
    const progressBar = document.querySelector('.loading-progress-bar');
    if (progressBar) {
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; // Force reflow
        progressBar.style.animation = 'progress-animation 2s ease-in-out forwards';
        progressBar.style.width = '0';
    }
}

/**
 * Complete loading progress bar immediately
 */
function completeLoadingProgress() {
    const progressBar = document.querySelector('.loading-progress-bar');
    if (progressBar) {
        progressBar.style.animation = 'none';
        progressBar.style.width = '100%';
    }
}

/**
 * Track actual page loading progress
 */
function trackLoadingProgress() {
    // Get progress bar element
    const progressBar = document.querySelector('.loading-progress-bar');
    if (!progressBar) return;

    // Track page load progress
    let loadProgress = 0;

    // Listen for resource load events
    const resources = performance.getEntriesByType('resource');
    const totalResources = resources.length || 1;
    let loadedResources = 0;

    // Create resource observer
    const resourceObserver = new PerformanceObserver((list) => {
        loadedResources++;
        const progress = Math.min(loadedResources / totalResources, 0.8); // Cap at 80%
        updateProgressBar(progress);
    });

    // Start observing resource timing entries
    try {
        resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
        console.warn('PerformanceObserver not supported');
    }

    // Update progress bar with current progress
    function updateProgressBar(progress) {
        if (progressBar && progress > loadProgress) {
            loadProgress = progress;
            progressBar.style.width = `${loadProgress * 100}%`;
        }
    }
}

/**
 * Update loading message
 * @param {string} message - The message to display
 */
function updateLoadingMessage(message) {
    const messageElement = document.querySelector('.loading-message');
    if (messageElement) {
        messageElement.textContent = message;
    }
}

/**
 * Get current page name for loading message
 * @returns {string} The page name
 */
function getPageName() {
    const path = window.location.pathname;

    if (path === '/' || path === '/index.html') {
        return 'Home Page';
    }

    // Extract page name from path
    const pageName = path.split('/').pop().replace('.html', '').replace(/-/g, ' ');

    // Capitalize first letter of each word
    return pageName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Page';
}

/**
 * Apply fade-in animation to main content
 */
function applyContentFadeIn() {
    // Add fade-in class to main content
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('page-transition');
    }

    // Add staggered animation to key elements
    const staggeredElements = document.querySelectorAll('.product-card, .feature-card, .section-title, .hero-content');
    staggeredElements.forEach((element, index) => {
        element.classList.add('staggered-item');

        // Add visible class with delay
        setTimeout(() => {
            element.classList.add('visible');
        }, 100 + (index * 100));
    });
}

/**
 * Show loading spinner in a container
 * @param {string} containerId - ID of the container to show spinner in
 * @param {string} size - Size of spinner: 'sm', 'md' (default), or 'lg'
 * @param {string} message - Optional message to display with spinner
 */
function showLoadingSpinner(containerId, size = 'md', message = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Create spinner element
    const spinnerDiv = document.createElement('div');
    spinnerDiv.className = 'loading-container';

    // Add spinner with appropriate size
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    if (size === 'sm') spinner.classList.add('loading-spinner-sm');
    if (size === 'lg') spinner.classList.add('loading-spinner-lg');
    spinnerDiv.appendChild(spinner);

    // Add message if provided
    if (message) {
        const messageEl = document.createElement('p');
        messageEl.className = 'ms-3 mb-0';
        messageEl.textContent = message;
        spinnerDiv.appendChild(messageEl);
    }

    // Add to container
    container.appendChild(spinnerDiv);
}

/**
 * Create and return a product card skeleton
 * @returns {HTMLElement} Product card skeleton element
 */
function createProductCardSkeleton() {
    const card = document.createElement('div');
    card.className = 'product-card-skeleton';

    card.innerHTML = `
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton-body">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-price"></div>
            <div class="skeleton skeleton-btn"></div>
        </div>
    `;

    return card;
}

/**
 * Show product card skeletons in a container
 * @param {string} containerId - ID of the container to show skeletons in
 * @param {number} count - Number of skeletons to show
 */
function showProductSkeletons(containerId, count = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Create row if needed
    let row;
    if (container.classList.contains('row')) {
        row = container;
    } else {
        row = document.createElement('div');
        row.className = 'row';
        container.appendChild(row);
    }

    // Add skeletons
    for (let i = 0; i < count; i++) {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6 mb-4';
        col.appendChild(createProductCardSkeleton());
        row.appendChild(col);
    }
}

// Export functions for use in other scripts
window.pageTransitions = {
    showOverlay: showPageTransitionOverlay,
    hideOverlay: hidePageTransitionOverlay,
    showLoadingSpinner: showLoadingSpinner,
    showProductSkeletons: showProductSkeletons,
    resetLoadingProgress: resetLoadingProgress,
    completeLoadingProgress: completeLoadingProgress,
    updateLoadingMessage: updateLoadingMessage,
    applyContentFadeIn: applyContentFadeIn
};
