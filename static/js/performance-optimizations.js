/**
 * Performance Optimizations for VarnikaKart
 * Improves website performance and loading times
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize performance optimizations
    initPerformanceOptimizations();
});

/**
 * Initialize all performance optimizations
 */
function initPerformanceOptimizations() {
    console.log('Initializing performance optimizations');
    
    // Lazy load images
    lazyLoadImages();
    
    // Defer non-critical CSS
    deferNonCriticalCSS();
    
    // Optimize animations
    optimizeAnimations();
    
    // Implement intersection observers
    implementIntersectionObservers();
    
    // Debounce resize events
    debounceResizeEvents();
    
    // Throttle scroll events
    throttleScrollEvents();
    
    // Preload important resources
    preloadImportantResources();
    
    // Clean up event listeners
    setupEventListenerCleanup();
}

/**
 * Lazy load images to improve initial page load
 */
function lazyLoadImages() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Get all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
        
        console.log(`Lazy loading ${lazyImages.length} images`);
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Defer loading of non-critical CSS
 */
function deferNonCriticalCSS() {
    // Get all link elements with data-defer attribute
    const deferredStyles = document.querySelectorAll('link[data-defer]');
    
    if (deferredStyles.length > 0) {
        console.log(`Deferring ${deferredStyles.length} CSS files`);
        
        // Create a function to load deferred styles
        const loadDeferredStyles = function() {
            deferredStyles.forEach(link => {
                link.setAttribute('rel', 'stylesheet');
                link.removeAttribute('data-defer');
            });
        };
        
        // Load styles after page load or after 2 seconds, whichever comes first
        if (window.requestIdleCallback) {
            window.requestIdleCallback(loadDeferredStyles);
        } else {
            window.addEventListener('load', loadDeferredStyles);
            setTimeout(loadDeferredStyles, 2000);
        }
    }
}

/**
 * Optimize animations for performance
 */
function optimizeAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.log('User prefers reduced motion, disabling animations');
        document.documentElement.classList.add('reduced-motion');
    }
    
    // Disable animations on low-end devices
    if (isLowEndDevice()) {
        console.log('Low-end device detected, reducing animations');
        document.documentElement.classList.add('reduced-animations');
    }
    
    // Use requestAnimationFrame for animations
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(element => {
        element.style.willChange = 'transform, opacity';
    });
}

/**
 * Detect if the device is low-end
 * @returns {boolean} True if the device is low-end
 */
function isLowEndDevice() {
    // Check for low memory
    if ('deviceMemory' in navigator) {
        if (navigator.deviceMemory < 4) {
            return true;
        }
    }
    
    // Check for slow CPU
    if ('hardwareConcurrency' in navigator) {
        if (navigator.hardwareConcurrency < 4) {
            return true;
        }
    }
    
    // Check for battery status
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            if (battery.charging === false && battery.level < 0.15) {
                document.documentElement.classList.add('reduced-animations');
            }
        });
    }
    
    return false;
}

/**
 * Implement intersection observers for better performance
 */
function implementIntersectionObservers() {
    // Create observer for elements that need to be animated when visible
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in-scroll, .slide-in-left, .slide-in-right, .zoom-in-scroll'
    );
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
    
    console.log(`Observing ${animatedElements.length} animated elements`);
}

/**
 * Debounce resize events to prevent excessive function calls
 */
function debounceResizeEvents() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        
        resizeTimer = setTimeout(function() {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
}

/**
 * Throttle scroll events to improve performance
 */
function throttleScrollEvents() {
    let scrollTimeout;
    let lastScrollY = window.scrollY;
    
    // Add throttled scroll event listener
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                // Clear timeout
                scrollTimeout = null;
                
                // Handle scroll event
                handleScroll(window.scrollY, lastScrollY);
                
                // Update last scroll position
                lastScrollY = window.scrollY;
            }, 100);
        }
    });
}

/**
 * Handle scroll events
 * @param {number} scrollY - Current scroll position
 * @param {number} lastScrollY - Previous scroll position
 */
function handleScroll(scrollY, lastScrollY) {
    // Handle navbar visibility
    const navbar = document.querySelector('.pro-navbar');
    if (navbar) {
        if (scrollY > 200) {
            if (scrollY > lastScrollY) {
                // Scrolling down
                navbar.classList.add('navbar-hidden');
            } else {
                // Scrolling up
                navbar.classList.remove('navbar-hidden');
                navbar.classList.add('navbar-fixed');
            }
        } else {
            // At the top
            navbar.classList.remove('navbar-fixed', 'navbar-hidden');
        }
    }
    
    // Handle back-to-top button visibility
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        if (scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
}

/**
 * Preload important resources
 */
function preloadImportantResources() {
    // Preload critical images
    const imagesToPreload = [
        '/static/img/logo.png',
        '/static/img/hero-bg.jpg'
    ];
    
    imagesToPreload.forEach(imageSrc => {
        const img = new Image();
        img.src = imageSrc;
    });
    
    // Preconnect to external domains
    const domainsToPreconnect = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com'
    ];
    
    domainsToPreconnect.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

/**
 * Set up cleanup for event listeners to prevent memory leaks
 */
function setupEventListenerCleanup() {
    // Store references to event listeners
    window.varnikaEventListeners = window.varnikaEventListeners || [];
    
    // Create a custom function to add event listeners with tracking
    window.addTrackedEventListener = function(element, type, listener, options) {
        element.addEventListener(type, listener, options);
        
        // Store reference for cleanup
        window.varnikaEventListeners.push({
            element: element,
            type: type,
            listener: listener,
            options: options
        });
    };
    
    // Create a function to remove all tracked event listeners
    window.removeAllTrackedEventListeners = function() {
        window.varnikaEventListeners.forEach(entry => {
            entry.element.removeEventListener(entry.type, entry.listener, entry.options);
        });
        
        window.varnikaEventListeners = [];
    };
    
    // Clean up event listeners when navigating away
    window.addEventListener('beforeunload', function() {
        window.removeAllTrackedEventListeners();
    });
}
