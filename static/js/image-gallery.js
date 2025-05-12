/**
 * Image Gallery and Zoom Feature for VarnikaKart
 * Enhanced image viewing experience for product pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize image gallery
    initImageGallery();
    
    // Listen for theme changes to reinitialize
    document.addEventListener('themeChanged', function() {
        initImageGallery();
    });
    
    // Listen for dark mode changes to reinitialize
    document.addEventListener('darkModeChanged', function() {
        initImageGallery();
    });
});

/**
 * Initialize image gallery functionality
 */
function initImageGallery() {
    console.log('Initializing image gallery');
    
    // Initialize product galleries
    initProductGalleries();
    
    // Initialize image zoom
    initImageZoom();
}

/**
 * Initialize product galleries
 */
function initProductGalleries() {
    const galleries = document.querySelectorAll('.product-gallery');
    
    galleries.forEach(gallery => {
        // Skip if already initialized
        if (gallery.getAttribute('data-gallery-initialized')) return;
        
        // Mark as initialized
        gallery.setAttribute('data-gallery-initialized', 'true');
        
        // Get gallery elements
        const mainImage = gallery.querySelector('.gallery-main img');
        const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
        
        // Add click event to thumbnails
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                const imgSrc = this.querySelector('img').getAttribute('src');
                mainImage.setAttribute('src', imgSrc);
                
                // Update active state
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Add navigation buttons if more than one thumbnail
        if (thumbnails.length > 1) {
            addGalleryNavigation(gallery, thumbnails);
        }
    });
}

/**
 * Add navigation buttons to gallery
 * @param {Element} gallery - The gallery container
 * @param {NodeList} thumbnails - The gallery thumbnails
 */
function addGalleryNavigation(gallery, thumbnails) {
    // Skip if navigation already exists
    if (gallery.querySelector('.gallery-nav')) return;
    
    // Create previous button
    const prevBtn = document.createElement('div');
    prevBtn.className = 'gallery-nav gallery-nav-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    // Create next button
    const nextBtn = document.createElement('div');
    nextBtn.className = 'gallery-nav gallery-nav-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Add click events
    prevBtn.addEventListener('click', function() {
        navigateGallery(gallery, thumbnails, 'prev');
    });
    
    nextBtn.addEventListener('click', function() {
        navigateGallery(gallery, thumbnails, 'next');
    });
    
    // Add to gallery
    const mainImageContainer = gallery.querySelector('.gallery-main');
    mainImageContainer.appendChild(prevBtn);
    mainImageContainer.appendChild(nextBtn);
}

/**
 * Navigate gallery
 * @param {Element} gallery - The gallery container
 * @param {NodeList} thumbnails - The gallery thumbnails
 * @param {string} direction - The navigation direction ('prev' or 'next')
 */
function navigateGallery(gallery, thumbnails, direction) {
    // Find active thumbnail
    const activeThumbnail = gallery.querySelector('.gallery-thumbnail.active') || thumbnails[0];
    let nextIndex;
    
    // Get current index
    let currentIndex = Array.from(thumbnails).indexOf(activeThumbnail);
    
    // Calculate next index
    if (direction === 'prev') {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = thumbnails.length - 1;
    } else {
        nextIndex = currentIndex + 1;
        if (nextIndex >= thumbnails.length) nextIndex = 0;
    }
    
    // Trigger click on next thumbnail
    thumbnails[nextIndex].click();
    
    // Scroll thumbnail into view
    thumbnails[nextIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
}

/**
 * Initialize image zoom functionality
 */
function initImageZoom() {
    // Get all main gallery images
    const mainImages = document.querySelectorAll('.gallery-main');
    
    mainImages.forEach(container => {
        // Skip if already initialized
        if (container.getAttribute('data-zoom-initialized')) return;
        
        // Mark as initialized
        container.setAttribute('data-zoom-initialized', 'true');
        
        // Add click event for zoom
        container.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openZoomModal(img);
            }
        });
    });
    
    // Create zoom modal if it doesn't exist
    createZoomModal();
}

/**
 * Create zoom modal
 */
function createZoomModal() {
    // Skip if modal already exists
    if (document.getElementById('zoomModal')) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'zoomModal';
    modal.className = 'zoom-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="zoom-container">
            <img src="" alt="Zoomed product image" class="zoom-image" id="zoomImage">
            <div class="zoom-close"><i class="fas fa-times"></i></div>
            <div class="zoom-nav zoom-nav-prev"><i class="fas fa-chevron-left"></i></div>
            <div class="zoom-nav zoom-nav-next"><i class="fas fa-chevron-right"></i></div>
            <div class="zoom-controls">
                <div class="zoom-control zoom-in"><i class="fas fa-search-plus"></i></div>
                <div class="zoom-control zoom-out"><i class="fas fa-search-minus"></i></div>
                <div class="zoom-control zoom-reset"><i class="fas fa-sync-alt"></i></div>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.zoom-close');
    closeBtn.addEventListener('click', closeZoomModal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeZoomModal();
        }
    });
    
    // Add zoom controls
    const zoomInBtn = modal.querySelector('.zoom-in');
    const zoomOutBtn = modal.querySelector('.zoom-out');
    const zoomResetBtn = modal.querySelector('.zoom-reset');
    
    zoomInBtn.addEventListener('click', function() {
        zoomImage('in');
    });
    
    zoomOutBtn.addEventListener('click', function() {
        zoomImage('out');
    });
    
    zoomResetBtn.addEventListener('click', function() {
        zoomImage('reset');
    });
    
    // Add navigation
    const prevBtn = modal.querySelector('.zoom-nav-prev');
    const nextBtn = modal.querySelector('.zoom-nav-next');
    
    prevBtn.addEventListener('click', function() {
        navigateZoom('prev');
    });
    
    nextBtn.addEventListener('click', function() {
        navigateZoom('next');
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            closeZoomModal();
        } else if (e.key === 'ArrowLeft') {
            navigateZoom('prev');
        } else if (e.key === 'ArrowRight') {
            navigateZoom('next');
        } else if (e.key === '+') {
            zoomImage('in');
        } else if (e.key === '-') {
            zoomImage('out');
        } else if (e.key === '0') {
            zoomImage('reset');
        }
    });
}

/**
 * Open zoom modal
 * @param {Element} img - The image to zoom
 */
function openZoomModal(img) {
    const modal = document.getElementById('zoomModal');
    const zoomImage = document.getElementById('zoomImage');
    
    // Set image source
    zoomImage.src = img.src;
    
    // Store current gallery info
    const gallery = img.closest('.product-gallery');
    if (gallery) {
        modal.setAttribute('data-gallery-id', gallery.id || '');
        
        // Find all thumbnails in this gallery
        const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
        const thumbnailSrcs = Array.from(thumbnails).map(thumb => 
            thumb.querySelector('img').src
        );
        
        // Store thumbnail sources
        modal.setAttribute('data-thumbnails', JSON.stringify(thumbnailSrcs));
        
        // Find current index
        const currentSrc = img.src;
        const currentIndex = thumbnailSrcs.indexOf(currentSrc);
        modal.setAttribute('data-current-index', currentIndex);
    }
    
    // Reset zoom level
    zoomImage.style.transform = 'scale(1)';
    
    // Show modal
    modal.classList.add('show');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Close zoom modal
 */
function closeZoomModal() {
    const modal = document.getElementById('zoomModal');
    
    // Hide modal
    modal.classList.remove('show');
    
    // Allow body scrolling
    document.body.style.overflow = '';
}

/**
 * Zoom image in/out
 * @param {string} direction - Zoom direction ('in', 'out', or 'reset')
 */
function zoomImage(direction) {
    const zoomImage = document.getElementById('zoomImage');
    
    // Get current scale
    const currentTransform = zoomImage.style.transform;
    let currentScale = 1;
    
    if (currentTransform) {
        const match = currentTransform.match(/scale\(([0-9.]+)\)/);
        if (match) {
            currentScale = parseFloat(match[1]);
        }
    }
    
    // Calculate new scale
    let newScale = currentScale;
    
    if (direction === 'in') {
        newScale = Math.min(currentScale + 0.2, 3);
    } else if (direction === 'out') {
        newScale = Math.max(currentScale - 0.2, 0.5);
    } else if (direction === 'reset') {
        newScale = 1;
    }
    
    // Apply new scale
    zoomImage.style.transform = `scale(${newScale})`;
}

/**
 * Navigate between images in zoom modal
 * @param {string} direction - Navigation direction ('prev' or 'next')
 */
function navigateZoom(direction) {
    const modal = document.getElementById('zoomModal');
    const zoomImage = document.getElementById('zoomImage');
    
    // Get thumbnails
    const thumbnailsStr = modal.getAttribute('data-thumbnails');
    if (!thumbnailsStr) return;
    
    const thumbnails = JSON.parse(thumbnailsStr);
    if (!thumbnails.length) return;
    
    // Get current index
    let currentIndex = parseInt(modal.getAttribute('data-current-index')) || 0;
    
    // Calculate next index
    let nextIndex;
    
    if (direction === 'prev') {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = thumbnails.length - 1;
    } else {
        nextIndex = currentIndex + 1;
        if (nextIndex >= thumbnails.length) nextIndex = 0;
    }
    
    // Update image
    zoomImage.src = thumbnails[nextIndex];
    
    // Update current index
    modal.setAttribute('data-current-index', nextIndex);
    
    // Reset zoom level
    zoomImage.style.transform = 'scale(1)';
}
