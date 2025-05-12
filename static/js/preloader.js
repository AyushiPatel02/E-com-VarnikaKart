/**
 * VarnikaKart Preloader
 * Handles preloading and page transitions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize preloader
    initPreloader();

    // Export preloader functions for use in other scripts
    window.preloaderFunctions = {
        showPreloader: showPreloader,
        hidePreloader: hidePreloader,
        resetLoadingProgress: resetLoadingProgress,
        completeLoadingProgress: completeLoadingProgress,
        updateLoadingMessage: updateLoadingMessage,
        getCreativeLoadingMessage: getCreativeLoadingMessage,
        applyContentFadeIn: applyContentFadeIn
    };
});

// Add loaded class to body when page is fully loaded
window.addEventListener('load', function() {
    // Add a small delay to ensure animations have completed
    setTimeout(() => {
        document.body.classList.add('loaded');
        console.log('Body marked as loaded');
    }, 1000);
});

/**
 * Initialize preloader
 */
function initPreloader() {
    console.log('Initializing preloader...');

    // Get preloader elements
    const preloader = document.querySelector('.page-transition-overlay');

    // If preloader doesn't exist, create it
    if (!preloader) {
        createPreloader();
    } else {
        // Add decorative elements to existing preloader
        addDecorativeElements(preloader);
    }

    // Show preloader
    showPreloader();

    // Track page load progress
    trackPageLoadProgress();

    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        // Ensure progress bar completes
        completeLoadingProgress();

        // Hide preloader after a short delay
        setTimeout(function() {
            hidePreloader();
        }, 500);
    });

    // Fallback: Hide preloader after 5 seconds even if page isn't fully loaded
    setTimeout(function() {
        completeLoadingProgress();
        hidePreloader();
    }, 5000);

    // Super fallback: Force hide preloader after 8 seconds in case something goes wrong
    setTimeout(function() {
        const preloader = document.querySelector('.page-transition-overlay');
        if (preloader && preloader.classList.contains('active')) {
            console.log('Force hiding preloader after timeout');
            preloader.classList.remove('active');
        }
    }, 8000);

    // Add event listeners to links for page transitions
    addLinkTransitions();
}

/**
 * Create preloader if it doesn't exist
 */
function createPreloader() {
    // Create preloader container
    const preloader = document.createElement('div');
    preloader.className = 'page-transition-overlay';

    // Create logo
    const logo = document.createElement('div');
    logo.className = 'page-transition-logo';
    logo.textContent = 'VarnikaKart';
    preloader.appendChild(logo);

    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    preloader.appendChild(spinner);

    // Create progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'loading-progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress-bar';

    progressContainer.appendChild(progressBar);
    preloader.appendChild(progressContainer);

    // Create loading message
    const message = document.createElement('div');
    message.className = 'loading-message';
    message.textContent = 'Loading your experience...';
    preloader.appendChild(message);

    // Add decorative elements
    addDecorativeElements(preloader);

    // Add to body
    document.body.insertBefore(preloader, document.body.firstChild);
}

/**
 * Add decorative elements to preloader
 * @param {Element} preloader - The preloader element
 */
function addDecorativeElements(preloader) {
    // Check if decorative elements already exist
    if (preloader.querySelector('.preloader-decoration')) {
        return;
    }

    // Create decoration container
    const decoration = document.createElement('div');
    decoration.className = 'preloader-decoration';

    // Create shapes
    const shape1 = document.createElement('div');
    shape1.className = 'preloader-shape preloader-shape-1';
    decoration.appendChild(shape1);

    const shape2 = document.createElement('div');
    shape2.className = 'preloader-shape preloader-shape-2';
    decoration.appendChild(shape2);

    const shape3 = document.createElement('div');
    shape3.className = 'preloader-shape preloader-shape-3';
    decoration.appendChild(shape3);

    // Add to preloader
    preloader.appendChild(decoration);
}

/**
 * Show preloader
 */
function showPreloader() {
    const preloader = document.querySelector('.page-transition-overlay');
    if (preloader) {
        // Reset progress bar
        resetLoadingProgress();

        // Show preloader
        preloader.classList.add('active');

        // Update with creative loading message
        updateLoadingMessage(getCreativeLoadingMessage());

        // Set up message rotation for longer loads
        setupMessageRotation();
    }
}

/**
 * Setup rotation of creative messages for longer loads
 */
function setupMessageRotation() {
    // Clear any existing interval
    if (window.messageRotationInterval) {
        clearInterval(window.messageRotationInterval);
    }

    // Set up new interval to change message every 3 seconds
    window.messageRotationInterval = setInterval(() => {
        // Only update if preloader is still visible
        const preloader = document.querySelector('.page-transition-overlay');
        if (preloader && preloader.classList.contains('active')) {
            updateLoadingMessage(getCreativeLoadingMessage());
        } else {
            // Clear interval if preloader is no longer visible
            clearInterval(window.messageRotationInterval);
        }
    }, 3000);

    // Clear interval after 15 seconds to prevent running indefinitely
    setTimeout(() => {
        if (window.messageRotationInterval) {
            clearInterval(window.messageRotationInterval);
        }
    }, 15000);
}

/**
 * Hide preloader
 */
function hidePreloader() {
    const preloader = document.querySelector('.page-transition-overlay');
    if (preloader) {
        // Clear message rotation interval
        if (window.messageRotationInterval) {
            clearInterval(window.messageRotationInterval);
        }

        // Ensure progress bar is complete
        completeLoadingProgress();

        // Update loading message with completion message
        const completionMessages = [
            "Your creation is ready!",
            "Masterpiece complete!",
            "Handcrafted with care!",
            "Your artisan experience awaits!",
            "Crafted to perfection!"
        ];
        const completionMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
        updateLoadingMessage(completionMessage);

        // Log for debugging
        console.log('Hiding preloader...');

        // Short delay to show completion message
        setTimeout(() => {
            // Hide preloader
            preloader.classList.remove('active');

            // Apply fade-in animation to main content
            applyContentFadeIn();

            // Force cleanup after a delay to ensure preloader is fully hidden
            setTimeout(() => {
                if (preloader.classList.contains('active')) {
                    console.log('Forcing preloader cleanup');
                    preloader.classList.remove('active');
                }

                // Make sure main content is visible
                const mainContent = document.querySelector('main') || document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.style.opacity = '1';
                    mainContent.style.visibility = 'visible';
                }

                // Make sure body is scrollable
                document.body.style.overflow = '';

            }, 1000);
        }, 300); // Reduced delay for better responsiveness
    }
}

/**
 * Reset loading progress bar
 */
function resetLoadingProgress() {
    // Use page-transitions.js function if available
    if (window.pageTransitions && window.pageTransitions.resetLoadingProgress) {
        window.pageTransitions.resetLoadingProgress();
        return;
    }

    // Fallback implementation
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
    // Use page-transitions.js function if available
    if (window.pageTransitions && window.pageTransitions.completeLoadingProgress) {
        window.pageTransitions.completeLoadingProgress();
        return;
    }

    // Fallback implementation
    const progressBar = document.querySelector('.loading-progress-bar');
    if (progressBar) {
        progressBar.style.animation = 'none';
        progressBar.style.width = '100%';
    }
}

/**
 * Track page load progress
 */
function trackPageLoadProgress() {
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
    try {
        const resourceObserver = new PerformanceObserver((list) => {
            loadedResources++;
            const progress = Math.min(loadedResources / totalResources, 0.8); // Cap at 80%
            updateProgressBar(progress);
        });

        // Start observing resource timing entries
        resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
        console.warn('PerformanceObserver not supported');

        // Fallback: Simulate progress
        simulateProgress();
    }

    // Update progress bar with current progress
    function updateProgressBar(progress) {
        if (progressBar && progress > loadProgress) {
            loadProgress = progress;
            progressBar.style.width = `${loadProgress * 100}%`;
        }
    }

    // Simulate progress for browsers that don't support PerformanceObserver
    function simulateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 0.05;
            if (progress >= 0.8) {
                clearInterval(interval);
            }
            updateProgressBar(progress);
        }, 200);
    }
}

/**
 * Update loading message
 * @param {string} message - The message to display
 */
function updateLoadingMessage(message) {
    // Use page-transitions.js function if available
    if (window.pageTransitions && window.pageTransitions.updateLoadingMessage) {
        window.pageTransitions.updateLoadingMessage(message);
        return;
    }

    // Fallback implementation
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
 * Get creative loading message based on page or random selection
 * @returns {string} A creative loading message
 */
function getCreativeLoadingMessage() {
    const path = window.location.pathname;
    const pageName = getPageName();

    // Page-specific messages
    if (path === '/' || path === '/index.html') {
        const homeMessages = [
            "Weaving your homepage experience...",
            "Painting your artisan journey...",
            "Crafting a beautiful welcome...",
            "Preparing your handcrafted homepage..."
        ];
        return homeMessages[Math.floor(Math.random() * homeMessages.length)];
    }

    if (path.includes('/product/') || path.includes('/products/')) {
        const productMessages = [
            "Arranging handcrafted treasures...",
            "Curating artisan masterpieces...",
            "Unveiling unique creations...",
            "Preparing handmade wonders..."
        ];
        return productMessages[Math.floor(Math.random() * productMessages.length)];
    }

    if (path.includes('/cart/') || path.includes('/checkout/')) {
        const cartMessages = [
            "Preparing your treasure chest...",
            "Wrapping your selections with care...",
            "Gathering your handpicked items...",
            "Arranging your artisan selections..."
        ];
        return cartMessages[Math.floor(Math.random() * cartMessages.length)];
    }

    // Generic creative messages
    const genericMessages = [
        "Spinning the potter's wheel...",
        "Weaving artistic experiences...",
        "Mixing colors on our palette...",
        "Carving your digital experience...",
        "Threading the creative needle...",
        "Polishing handcrafted details..."
    ];

    return genericMessages[Math.floor(Math.random() * genericMessages.length)];
}

/**
 * Apply fade-in animation to main content
 */
function applyContentFadeIn() {
    // Use page-transitions.js function if available
    if (window.pageTransitions && window.pageTransitions.applyContentFadeIn) {
        window.pageTransitions.applyContentFadeIn();
        return;
    }

    // Fallback implementation
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('page-transition');

        // Determine page type for appropriate animation
        const path = window.location.pathname;
        const fullUrl = window.location.href;

        if (path === '/' || path === '/index.html') {
            // Home page
            mainContent.classList.add('page-fade-in');
        } else if (path.includes('/products/') || path.includes('/category/') ||
                  fullUrl.includes('collection=') || fullUrl.includes('category=')) {
            // Product or category page (including query parameters)
            mainContent.classList.add('page-slide-up');
        } else if (path.includes('/cart/') || path.includes('/checkout/')) {
            // Cart or checkout page
            mainContent.classList.add('page-slide-in-right');
        } else if (path.includes('/account/') || path.includes('/profile/')) {
            // Account or profile page
            mainContent.classList.add('page-slide-in-left');
        } else if (path.includes('/deals/') || path.includes('/trending/')) {
            // Deals or trending page
            mainContent.classList.add('page-slide-up');
        } else {
            // Default transition
            mainContent.classList.add('page-zoom-in');
        }
    }
}

/**
 * Add event listeners to links for page transitions
 * This is a more careful implementation that avoids conflicts with page-transitions.js
 */
function addLinkTransitions() {
    // Check if page-transitions.js is already handling transitions
    if (window.pageTransitions && window.pageTransitions.showOverlay) {
        console.log('Page transitions already handled by page-transitions.js');
        return;
    }

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

            // Show preloader
            e.preventDefault();
            showPreloader();

            // Log navigation for debugging
            console.log('Navigating to:', href);

            // Navigate after a delay to ensure preloader is visible
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
}
