/**
 * Interactive Product Cards for VarnikaKart
 * Adds enhanced interactive features to product cards
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize product card features
    initProductCards();
    
    // Listen for theme changes to reinitialize
    document.addEventListener('themeChanged', function() {
        initProductCards();
    });
    
    // Listen for dark mode changes to reinitialize
    document.addEventListener('darkModeChanged', function() {
        initProductCards();
    });
});

/**
 * Initialize all product card features
 */
function initProductCards() {
    console.log('Initializing product card features');
    
    // Add quick action buttons
    addQuickActionButtons();
    
    // Add hover effects
    addHoverEffects();
    
    // Add color options
    addColorOptions();
    
    // Add image zoom
    addImageZoom();
    
    // Add quick view
    addQuickView();
    
    // Add scroll animations
    addScrollAnimations();
}

/**
 * Add quick action buttons to product cards
 */
function addQuickActionButtons() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Skip if quick actions already exist
        if (card.querySelector('.quick-actions')) return;
        
        // Create quick actions container
        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';
        
        // Add wishlist button
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'quick-action-btn wishlist-btn';
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        wishlistBtn.setAttribute('title', 'Add to Wishlist');
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(this);
        });
        
        // Add compare button
        const compareBtn = document.createElement('button');
        compareBtn.className = 'quick-action-btn compare-btn';
        compareBtn.innerHTML = '<i class="fas fa-exchange-alt"></i>';
        compareBtn.setAttribute('title', 'Compare');
        compareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(this);
        });
        
        // Add quick view button
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-action-btn quick-view-btn';
        quickViewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        quickViewBtn.setAttribute('title', 'Quick View');
        quickViewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showQuickView(card);
        });
        
        // Add buttons to container
        quickActions.appendChild(wishlistBtn);
        quickActions.appendChild(compareBtn);
        quickActions.appendChild(quickViewBtn);
        
        // Add container to card
        card.appendChild(quickActions);
    });
}

/**
 * Toggle wishlist status
 * @param {Element} button - The wishlist button
 */
function toggleWishlist(button) {
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        button.style.backgroundColor = '#e74c3c';
        button.style.color = '#ffffff';
        showToast('Product added to wishlist');
    } else {
        button.style.backgroundColor = '#ffffff';
        button.style.color = 'var(--primary-color)';
        showToast('Product removed from wishlist');
    }
}

/**
 * Toggle compare status
 * @param {Element} button - The compare button
 */
function toggleCompare(button) {
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        button.style.backgroundColor = 'var(--primary-color)';
        button.style.color = '#ffffff';
        showToast('Product added to compare');
    } else {
        button.style.backgroundColor = '#ffffff';
        button.style.color = 'var(--primary-color)';
        showToast('Product removed from compare');
    }
}

/**
 * Add hover effects to product cards
 */
function addHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add hover classes
        card.classList.add('hover-lift');
        
        // Add image hover effect
        const image = card.querySelector('.card-img-top');
        if (image) {
            image.classList.add('hover-scale');
        }
        
        // Add button hover effect
        const button = card.querySelector('.btn');
        if (button) {
            button.classList.add('btn-hover-slide');
        }
    });
}

/**
 * Add color options to product cards
 */
function addColorOptions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Skip if color options already exist
        if (card.querySelector('.color-options')) return;
        
        // Create color options container
        const colorOptions = document.createElement('div');
        colorOptions.className = 'color-options';
        
        // Generate random colors (in a real app, these would come from the product data)
        const colors = ['#ff5722', '#2196f3', '#4caf50', '#9c27b0', '#ffeb3b'];
        const availableColors = colors.slice(0, Math.floor(Math.random() * 3) + 2);
        
        availableColors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.setAttribute('data-color', color);
            colorOption.setAttribute('title', `Color: ${color}`);
            
            colorOption.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                selectColor(this, card);
            });
            
            colorOptions.appendChild(colorOption);
        });
        
        // Add container to card body
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            cardBody.appendChild(colorOptions);
        }
    });
}

/**
 * Select a color option
 * @param {Element} colorElement - The color element
 * @param {Element} card - The product card
 */
function selectColor(colorElement, card) {
    // Remove active class from all colors
    const allColors = card.querySelectorAll('.color-option');
    allColors.forEach(c => c.classList.remove('active'));
    
    // Add active class to selected color
    colorElement.classList.add('active');
    
    // Show selected color
    const color = colorElement.getAttribute('data-color');
    showToast(`Color selected: ${color}`);
}

/**
 * Add image zoom functionality to product cards
 */
function addImageZoom() {
    const productImages = document.querySelectorAll('.product-card .card-img-top');
    
    productImages.forEach(image => {
        // Skip if already initialized
        if (image.getAttribute('data-zoom-initialized')) return;
        
        // Mark as initialized
        image.setAttribute('data-zoom-initialized', 'true');
        
        // Add zoom effect on hover
        image.addEventListener('mousemove', function(e) {
            const card = this.closest('.product-card');
            if (!card) return;
            
            // Only apply zoom if card has hover class
            if (!card.matches(':hover')) return;
            
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            this.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        });
        
        // Reset on mouse leave
        image.addEventListener('mouseleave', function() {
            this.style.transformOrigin = 'center center';
        });
    });
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 */
function showToast(message) {
    // Check if toast container exists
    let toastContainer = document.querySelector('.toast-container');
    
    // Create container if it doesn't exist
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Show quick view modal for a product
 * @param {Element} card - The product card
 */
function showQuickView(card) {
    // Get product details
    const image = card.querySelector('.card-img-top').src;
    const title = card.querySelector('.card-title').textContent;
    const text = card.querySelector('.card-text').textContent;
    
    // Create modal if it doesn't exist
    let quickViewModal = document.getElementById('quickViewModal');
    
    if (!quickViewModal) {
        quickViewModal = document.createElement('div');
        quickViewModal.id = 'quickViewModal';
        quickViewModal.className = 'quick-view-modal';
        
        // Create modal content
        quickViewModal.innerHTML = `
            <div class="quick-view-content">
                <button class="close-modal">&times;</button>
                <div class="row">
                    <div class="col-md-6">
                        <img src="" alt="" class="img-fluid quick-view-image">
                    </div>
                    <div class="col-md-6">
                        <h3 class="quick-view-title"></h3>
                        <p class="quick-view-text"></p>
                        <div class="quick-view-price"></div>
                        <div class="quick-view-actions">
                            <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
                            <button class="btn btn-outline-primary wishlist-btn">Add to Wishlist</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(quickViewModal);
        
        // Add close functionality
        const closeBtn = quickViewModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            quickViewModal.classList.remove('show');
        });
        
        // Close on click outside
        quickViewModal.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                quickViewModal.classList.remove('show');
            }
        });
    }
    
    // Update modal content
    quickViewModal.querySelector('.quick-view-image').src = image;
    quickViewModal.querySelector('.quick-view-title').textContent = title;
    quickViewModal.querySelector('.quick-view-text').textContent = text;
    
    // Show modal
    quickViewModal.classList.add('show');
}

/**
 * Add scroll animations to product cards
 */
function addScrollAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Add animation classes and observe
    productCards.forEach((card, index) => {
        // Add staggered animation class
        card.classList.add('staggered-item');
        
        // Observe card
        observer.observe(card);
    });
}
