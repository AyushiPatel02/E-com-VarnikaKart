/**
 * Wishlist and Compare Functionality for VarnikaKart
 * Enhanced wishlist and product comparison features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize wishlist and compare functionality
    initWishlistCompare();
    
    // Listen for theme changes to reinitialize
    document.addEventListener('themeChanged', function() {
        initWishlistCompare();
    });
    
    // Listen for dark mode changes to reinitialize
    document.addEventListener('darkModeChanged', function() {
        initWishlistCompare();
    });
});

/**
 * Initialize wishlist and compare functionality
 */
function initWishlistCompare() {
    console.log('Initializing wishlist and compare functionality');
    
    // Initialize wishlist
    initWishlist();
    
    // Initialize compare
    initCompare();
    
    // Update counters
    updateWishlistCounter();
    updateCompareCounter();
}

/**
 * Initialize wishlist functionality
 */
function initWishlist() {
    // Get all wishlist buttons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        // Skip if already initialized
        if (button.getAttribute('data-wishlist-initialized')) return;
        
        // Mark as initialized
        button.setAttribute('data-wishlist-initialized', 'true');
        
        // Get product ID
        const productId = button.getAttribute('data-product-id');
        
        // Check if product is in wishlist
        const isInWishlist = isProductInWishlist(productId);
        
        // Update button state
        if (isInWishlist) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle wishlist status
            toggleWishlistStatus(productId, this);
        });
    });
    
    // Initialize wishlist page functionality
    initWishlistPage();
}

/**
 * Initialize wishlist page functionality
 */
function initWishlistPage() {
    // Get wishlist container
    const wishlistContainer = document.querySelector('.wishlist-container');
    
    if (wishlistContainer) {
        // Get clear wishlist button
        const clearButton = wishlistContainer.querySelector('.wishlist-clear');
        
        if (clearButton) {
            // Add click event listener
            clearButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear wishlist
                clearWishlist();
                
                // Reload page
                window.location.reload();
            });
        }
        
        // Get share wishlist button
        const shareButton = wishlistContainer.querySelector('.wishlist-share');
        
        if (shareButton) {
            // Add click event listener
            shareButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Share wishlist
                shareWishlist();
            });
        }
        
        // Get all remove buttons
        const removeButtons = wishlistContainer.querySelectorAll('.wishlist-item-remove');
        
        removeButtons.forEach(button => {
            // Add click event listener
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product ID
                const productId = this.getAttribute('data-product-id');
                
                // Remove from wishlist
                removeFromWishlist(productId);
                
                // Remove item from DOM
                const item = this.closest('.wishlist-item');
                if (item) {
                    item.remove();
                }
                
                // Update counter
                updateWishlistCounter();
                
                // Check if wishlist is empty
                const items = wishlistContainer.querySelectorAll('.wishlist-item');
                if (items.length === 0) {
                    // Show empty wishlist message
                    showEmptyWishlist(wishlistContainer);
                }
                
                // Show toast notification
                showToast('Product removed from wishlist');
            });
        });
    }
}

/**
 * Show empty wishlist message
 * @param {Element} container - The wishlist container
 */
function showEmptyWishlist(container) {
    // Create empty wishlist message
    const emptyWishlist = document.createElement('div');
    emptyWishlist.className = 'empty-wishlist';
    emptyWishlist.innerHTML = `
        <i class="fas fa-heart-broken"></i>
        <h3 class="empty-wishlist-title">Your wishlist is empty</h3>
        <p class="empty-wishlist-text">You haven't added any products to your wishlist yet.</p>
        <a href="/products/" class="btn btn-primary">Continue Shopping</a>
    `;
    
    // Clear container
    container.innerHTML = '';
    
    // Add empty wishlist message
    container.appendChild(emptyWishlist);
}

/**
 * Toggle wishlist status for a product
 * @param {string} productId - The product ID
 * @param {Element} button - The wishlist button
 */
function toggleWishlistStatus(productId, button) {
    // Check if product is in wishlist
    const isInWishlist = isProductInWishlist(productId);
    
    if (isInWishlist) {
        // Remove from wishlist
        removeFromWishlist(productId);
        
        // Update button state
        button.classList.remove('active');
        
        // Show toast notification
        showToast('Product removed from wishlist');
    } else {
        // Add to wishlist
        addToWishlist(productId);
        
        // Update button state
        button.classList.add('active');
        
        // Show toast notification
        showToast('Product added to wishlist');
    }
    
    // Update counter
    updateWishlistCounter();
}

/**
 * Check if product is in wishlist
 * @param {string} productId - The product ID
 * @returns {boolean} True if product is in wishlist
 */
function isProductInWishlist(productId) {
    // Get wishlist from localStorage
    const wishlist = getWishlist();
    
    // Check if product is in wishlist
    return wishlist.includes(productId);
}

/**
 * Get wishlist from localStorage
 * @returns {Array} Wishlist array
 */
function getWishlist() {
    try {
        // Get wishlist from localStorage
        const wishlist = localStorage.getItem('varnikakart-wishlist');
        
        // Parse wishlist or return empty array
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
        console.error('Error getting wishlist:', error);
        return [];
    }
}

/**
 * Add product to wishlist
 * @param {string} productId - The product ID
 */
function addToWishlist(productId) {
    try {
        // Get current wishlist
        let wishlist = getWishlist();
        
        // Add product if not already in wishlist
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
        }
        
        // Save wishlist to localStorage
        localStorage.setItem('varnikakart-wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('Error adding to wishlist:', error);
    }
}

/**
 * Remove product from wishlist
 * @param {string} productId - The product ID
 */
function removeFromWishlist(productId) {
    try {
        // Get current wishlist
        let wishlist = getWishlist();
        
        // Remove product from wishlist
        wishlist = wishlist.filter(id => id !== productId);
        
        // Save wishlist to localStorage
        localStorage.setItem('varnikakart-wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('Error removing from wishlist:', error);
    }
}

/**
 * Clear wishlist
 */
function clearWishlist() {
    try {
        // Clear wishlist in localStorage
        localStorage.setItem('varnikakart-wishlist', JSON.stringify([]));
    } catch (error) {
        console.error('Error clearing wishlist:', error);
    }
}

/**
 * Share wishlist
 */
function shareWishlist() {
    // Get wishlist
    const wishlist = getWishlist();
    
    // Create share URL
    const shareUrl = `${window.location.origin}/wishlist/?share=${encodeURIComponent(wishlist.join(','))}`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'My VarnikaKart Wishlist',
            text: 'Check out my wishlist on VarnikaKart!',
            url: shareUrl
        })
        .then(() => console.log('Wishlist shared successfully'))
        .catch(error => console.error('Error sharing wishlist:', error));
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                showToast('Wishlist URL copied to clipboard');
            })
            .catch(error => {
                console.error('Error copying to clipboard:', error);
                
                // Fallback to prompt
                prompt('Copy this URL to share your wishlist:', shareUrl);
            });
    }
}

/**
 * Update wishlist counter
 */
function updateWishlistCounter() {
    // Get wishlist
    const wishlist = getWishlist();
    
    // Get all wishlist counters
    const counters = document.querySelectorAll('.wishlist-counter');
    
    counters.forEach(counter => {
        // Update counter text
        counter.textContent = wishlist.length;
        
        // Show/hide counter
        if (wishlist.length > 0) {
            counter.classList.add('show');
        } else {
            counter.classList.remove('show');
        }
    });
}

/**
 * Initialize compare functionality
 */
function initCompare() {
    // Get all compare buttons
    const compareButtons = document.querySelectorAll('.compare-btn');
    
    compareButtons.forEach(button => {
        // Skip if already initialized
        if (button.getAttribute('data-compare-initialized')) return;
        
        // Mark as initialized
        button.setAttribute('data-compare-initialized', 'true');
        
        // Get product ID
        const productId = button.getAttribute('data-product-id');
        
        // Check if product is in compare list
        const isInCompare = isProductInCompare(productId);
        
        // Update button state
        if (isInCompare) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle compare status
            toggleCompareStatus(productId, this);
        });
    });
    
    // Initialize compare drawer
    initCompareDrawer();
    
    // Initialize compare page
    initComparePage();
}

/**
 * Initialize compare drawer
 */
function initCompareDrawer() {
    // Get compare drawer
    const compareDrawer = document.querySelector('.compare-drawer');
    
    if (!compareDrawer) {
        // Create compare drawer
        createCompareDrawer();
    } else {
        // Update compare drawer
        updateCompareDrawer();
    }
}

/**
 * Create compare drawer
 */
function createCompareDrawer() {
    // Create drawer element
    const drawer = document.createElement('div');
    drawer.className = 'compare-drawer';
    
    // Create drawer content
    drawer.innerHTML = `
        <div class="compare-drawer-header">
            <div>
                <span class="compare-drawer-title">Compare Products</span>
                <span class="compare-drawer-count">(0)</span>
            </div>
            <button class="compare-drawer-close">&times;</button>
        </div>
        <div class="compare-drawer-content"></div>
        <div class="compare-drawer-actions">
            <button class="compare-drawer-clear">Clear All</button>
            <button class="compare-drawer-view">Compare Now</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(drawer);
    
    // Add event listeners
    const closeButton = drawer.querySelector('.compare-drawer-close');
    const clearButton = drawer.querySelector('.compare-drawer-clear');
    const viewButton = drawer.querySelector('.compare-drawer-view');
    
    // Close button
    closeButton.addEventListener('click', function() {
        drawer.classList.remove('show');
    });
    
    // Clear button
    clearButton.addEventListener('click', function() {
        clearCompare();
        updateCompareDrawer();
        updateCompareCounter();
        
        // Update all compare buttons
        const compareButtons = document.querySelectorAll('.compare-btn');
        compareButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Show toast notification
        showToast('Compare list cleared');
    });
    
    // View button
    viewButton.addEventListener('click', function() {
        window.location.href = '/compare/';
    });
    
    // Update drawer content
    updateCompareDrawer();
}

/**
 * Update compare drawer
 */
function updateCompareDrawer() {
    // Get compare drawer
    const drawer = document.querySelector('.compare-drawer');
    
    if (!drawer) return;
    
    // Get compare list
    const compareList = getCompare();
    
    // Update count
    const countElement = drawer.querySelector('.compare-drawer-count');
    if (countElement) {
        countElement.textContent = `(${compareList.length})`;
    }
    
    // Get content container
    const content = drawer.querySelector('.compare-drawer-content');
    
    if (!content) return;
    
    // Clear content
    content.innerHTML = '';
    
    // Add items to drawer
    compareList.forEach(item => {
        // Create item element
        const itemElement = document.createElement('div');
        itemElement.className = 'compare-drawer-item';
        
        // Create item content
        itemElement.innerHTML = `
            <div class="compare-drawer-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="compare-drawer-item-title">${item.title}</div>
            <div class="compare-drawer-item-price">₹${item.price}</div>
            <button class="compare-drawer-item-remove" data-product-id="${item.id}">&times;</button>
        `;
        
        // Add to content
        content.appendChild(itemElement);
        
        // Add remove button event listener
        const removeButton = itemElement.querySelector('.compare-drawer-item-remove');
        removeButton.addEventListener('click', function() {
            // Get product ID
            const productId = this.getAttribute('data-product-id');
            
            // Remove from compare
            removeFromCompare(productId);
            
            // Update drawer
            updateCompareDrawer();
            
            // Update counter
            updateCompareCounter();
            
            // Update button state
            const button = document.querySelector(`.compare-btn[data-product-id="${productId}"]`);
            if (button) {
                button.classList.remove('active');
            }
            
            // Show toast notification
            showToast('Product removed from compare');
        });
    });
    
    // Show drawer if items exist
    if (compareList.length > 0) {
        drawer.classList.add('show');
    } else {
        drawer.classList.remove('show');
    }
}

/**
 * Initialize compare page
 */
function initComparePage() {
    // Get compare table
    const compareTable = document.querySelector('.compare-table');
    
    if (compareTable) {
        // Get all remove buttons
        const removeButtons = compareTable.querySelectorAll('.compare-table-remove');
        
        removeButtons.forEach(button => {
            // Add click event listener
            button.addEventListener('click', function() {
                // Get product ID
                const productId = this.getAttribute('data-product-id');
                
                // Remove from compare
                removeFromCompare(productId);
                
                // Reload page
                window.location.reload();
            });
        });
    }
}

/**
 * Toggle compare status for a product
 * @param {string} productId - The product ID
 * @param {Element} button - The compare button
 */
function toggleCompareStatus(productId, button) {
    // Check if product is in compare list
    const isInCompare = isProductInCompare(productId);
    
    if (isInCompare) {
        // Remove from compare
        removeFromCompare(productId);
        
        // Update button state
        button.classList.remove('active');
        
        // Show toast notification
        showToast('Product removed from compare');
    } else {
        // Get compare list
        const compareList = getCompare();
        
        // Check if compare list is full (max 4 items)
        if (compareList.length >= 4) {
            // Show toast notification
            showToast('Compare list is full (max 4 items)', 'warning');
            return;
        }
        
        // Get product details
        const product = getProductDetails(productId, button);
        
        // Add to compare
        addToCompare(product);
        
        // Update button state
        button.classList.add('active');
        
        // Show toast notification
        showToast('Product added to compare');
    }
    
    // Update drawer
    updateCompareDrawer();
    
    // Update counter
    updateCompareCounter();
}

/**
 * Get product details from DOM
 * @param {string} productId - The product ID
 * @param {Element} button - The compare button
 * @returns {Object} Product details
 */
function getProductDetails(productId, button) {
    // Get product card
    const card = button.closest('.product-card');
    
    if (card) {
        // Get product details from card
        const title = card.querySelector('.card-title')?.textContent || 'Product';
        const price = card.querySelector('.card-price')?.textContent?.replace('₹', '') || '0';
        const image = card.querySelector('.card-img-top')?.src || '/static/img/placeholder.jpg';
        
        return {
            id: productId,
            title,
            price,
            image
        };
    }
    
    // Default product details
    return {
        id: productId,
        title: 'Product',
        price: '0',
        image: '/static/img/placeholder.jpg'
    };
}

/**
 * Check if product is in compare list
 * @param {string} productId - The product ID
 * @returns {boolean} True if product is in compare list
 */
function isProductInCompare(productId) {
    // Get compare list from localStorage
    const compareList = getCompare();
    
    // Check if product is in compare list
    return compareList.some(item => item.id === productId);
}

/**
 * Get compare list from localStorage
 * @returns {Array} Compare list array
 */
function getCompare() {
    try {
        // Get compare list from localStorage
        const compareList = localStorage.getItem('varnikakart-compare');
        
        // Parse compare list or return empty array
        return compareList ? JSON.parse(compareList) : [];
    } catch (error) {
        console.error('Error getting compare list:', error);
        return [];
    }
}

/**
 * Add product to compare list
 * @param {Object} product - The product details
 */
function addToCompare(product) {
    try {
        // Get current compare list
        let compareList = getCompare();
        
        // Add product if not already in compare list
        if (!compareList.some(item => item.id === product.id)) {
            compareList.push(product);
        }
        
        // Save compare list to localStorage
        localStorage.setItem('varnikakart-compare', JSON.stringify(compareList));
    } catch (error) {
        console.error('Error adding to compare:', error);
    }
}

/**
 * Remove product from compare list
 * @param {string} productId - The product ID
 */
function removeFromCompare(productId) {
    try {
        // Get current compare list
        let compareList = getCompare();
        
        // Remove product from compare list
        compareList = compareList.filter(item => item.id !== productId);
        
        // Save compare list to localStorage
        localStorage.setItem('varnikakart-compare', JSON.stringify(compareList));
    } catch (error) {
        console.error('Error removing from compare:', error);
    }
}

/**
 * Clear compare list
 */
function clearCompare() {
    try {
        // Clear compare list in localStorage
        localStorage.setItem('varnikakart-compare', JSON.stringify([]));
    } catch (error) {
        console.error('Error clearing compare list:', error);
    }
}

/**
 * Update compare counter
 */
function updateCompareCounter() {
    // Get compare list
    const compareList = getCompare();
    
    // Get all compare counters
    const counters = document.querySelectorAll('.compare-counter');
    
    counters.forEach(counter => {
        // Update counter text
        counter.textContent = compareList.length;
        
        // Show/hide counter
        if (compareList.length > 0) {
            counter.classList.add('show');
        } else {
            counter.classList.remove('show');
        }
    });
}

/**
 * Show toast notification
 * @param {string} message - The message to display
 * @param {string} type - The toast type (success, error, warning, info)
 */
function showToast(message, type = 'success') {
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
    toast.className = `toast ${type}`;
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
