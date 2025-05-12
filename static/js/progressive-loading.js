/**
 * Progressive Loading for VarnikaKart
 * Improves page load performance with progressive loading techniques
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize progressive loading
    initProgressiveLoading();
});

/**
 * Initialize progressive loading techniques
 */
function initProgressiveLoading() {
    console.log('Initializing progressive loading');
    
    // Implement lazy loading for images
    lazyLoadImages();
    
    // Implement progressive image loading
    setupProgressiveImages();
    
    // Implement content prioritization
    prioritizeContent();
    
    // Setup skeleton screens
    setupSkeletonScreens();
    
    // Implement critical CSS inlining
    handleCriticalCSS();
    
    // Preload important resources
    preloadImportantResources();
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
                        // Create a new image to preload
                        const preloadImg = new Image();
                        
                        // When the image is loaded, update the visible image
                        preloadImg.onload = function() {
                            img.src = src;
                            img.classList.add('loaded');
                        };
                        
                        // Start loading the image
                        preloadImg.src = src;
                        
                        // Remove data-src to prevent reloading
                        img.removeAttribute('data-src');
                        
                        // Stop observing the image
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
            // Add a placeholder or low-quality image if not already present
            if (!img.src && !img.classList.contains('progressive-image')) {
                img.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 1 1%22%3E%3C%2Fsvg%3E';
            }
            
            // Add loading class
            img.classList.add('lazy-loading');
            
            // Start observing
            imageObserver.observe(img);
        });
        
        console.log(`Lazy loading ${lazyImages.length} images`);
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Setup progressive image loading with low-quality placeholders
 */
function setupProgressiveImages() {
    const progressiveImages = document.querySelectorAll('.progressive-image');
    
    progressiveImages.forEach(container => {
        const thumbnail = container.querySelector('.thumbnail');
        const fullImage = container.querySelector('.full-image');
        
        if (thumbnail && fullImage && fullImage.getAttribute('data-src')) {
            // Create a new image to preload the full version
            const preloadImg = new Image();
            
            // When the full image is loaded
            preloadImg.onload = function() {
                // Update the full image source
                fullImage.src = fullImage.getAttribute('data-src');
                
                // Add loaded class to container
                container.classList.add('loaded');
                
                // Remove blur from thumbnail
                setTimeout(() => {
                    thumbnail.style.opacity = '0';
                }, 300);
            };
            
            // Start loading the full image
            preloadImg.src = fullImage.getAttribute('data-src');
        }
    });
}

/**
 * Prioritize content loading based on visibility
 */
function prioritizeContent() {
    // Prioritize above-the-fold content
    const aboveTheFoldContent = document.querySelectorAll('.hero-section, .navbar, .top-products');
    
    // Defer loading of below-the-fold content
    const belowTheFoldContent = document.querySelectorAll('.newsletter-section, .footer, .testimonials');
    
    // Create intersection observer for below-the-fold content
    const contentObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load deferred content
                const element = entry.target;
                
                // If element has data-src attribute, load it
                if (element.getAttribute('data-src')) {
                    element.src = element.getAttribute('data-src');
                    element.removeAttribute('data-src');
                }
                
                // If element has data-background attribute, load it
                if (element.getAttribute('data-background')) {
                    element.style.backgroundImage = `url(${element.getAttribute('data-background')})`;
                    element.removeAttribute('data-background');
                }
                
                // If element has lazy-load-html class, load its content
                if (element.classList.contains('lazy-load-html') && element.getAttribute('data-html-src')) {
                    loadHTMLContent(element, element.getAttribute('data-html-src'));
                }
                
                // Stop observing the element
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.1
    });
    
    // Observe below-the-fold content
    belowTheFoldContent.forEach(element => {
        contentObserver.observe(element);
    });
}

/**
 * Load HTML content dynamically
 * @param {Element} element - The element to load content into
 * @param {string} url - The URL to load content from
 */
function loadHTMLContent(element, url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            element.innerHTML = html;
            element.classList.add('loaded');
            
            // Initialize any scripts in the loaded content
            const scripts = element.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                
                // Copy all attributes
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                
                // Copy inline script content
                newScript.textContent = script.textContent;
                
                // Replace old script with new one
                script.parentNode.replaceChild(newScript, script);
            });
        })
        .catch(error => {
            console.error('Error loading HTML content:', error);
            element.innerHTML = '<p>Error loading content. Please try again later.</p>';
        });
}

/**
 * Setup skeleton screens for content that's loading
 */
function setupSkeletonScreens() {
    // Replace product containers with skeletons while loading
    const productContainers = document.querySelectorAll('.products-container');
    
    productContainers.forEach(container => {
        // Skip if already has skeletons
        if (container.querySelector('.product-card-skeleton')) return;
        
        // Get number of products to show
        const productCount = container.getAttribute('data-product-count') || 4;
        
        // Create skeleton row
        const skeletonRow = document.createElement('div');
        skeletonRow.className = 'row skeleton-row';
        
        // Add skeleton cards
        for (let i = 0; i < productCount; i++) {
            const col = document.createElement('div');
            col.className = 'col-md-3 col-sm-6 mb-4';
            
            // Create skeleton card
            const skeleton = document.createElement('div');
            skeleton.className = 'product-card-skeleton';
            skeleton.innerHTML = `
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton-body">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-price"></div>
                    <div class="skeleton skeleton-btn"></div>
                </div>
            `;
            
            col.appendChild(skeleton);
            skeletonRow.appendChild(col);
        }
        
        // Add skeleton row to container
        container.appendChild(skeletonRow);
        
        // Hide skeleton when products are loaded
        const productsRow = container.querySelector('.row:not(.skeleton-row)');
        if (productsRow) {
            productsRow.style.display = 'none';
            
            // Show actual products after delay
            setTimeout(() => {
                skeletonRow.style.display = 'none';
                productsRow.style.display = 'flex';
            }, 1500);
        }
    });
}

/**
 * Handle critical CSS for faster initial render
 */
function handleCriticalCSS() {
    // Load non-critical CSS asynchronously
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-critical="false"]');
    
    nonCriticalCSS.forEach(link => {
        // Change to preload to avoid blocking render
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'style');
        
        // Load the stylesheet after page load
        window.addEventListener('load', () => {
            link.setAttribute('rel', 'stylesheet');
        });
    });
}

/**
 * Preload important resources
 */
function preloadImportantResources() {
    // Preload critical images
    const criticalImages = [
        '/static/img/logo.png',
        '/static/img/hero-bg.jpg'
    ];
    
    criticalImages.forEach(imageSrc => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageSrc;
        document.head.appendChild(link);
    });
    
    // Preconnect to external domains
    const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com'
    ];
    
    domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}
