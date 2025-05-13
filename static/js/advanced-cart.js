/**
 * Advanced Cart Functionality for VarnikaKart
 * Enhanced shopping cart experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced cart
    initAdvancedCart();
    
    // Listen for theme changes to reinitialize
    document.addEventListener('themeChanged', function() {
        initAdvancedCart();
    });
    
    // Listen for dark mode changes to reinitialize
    document.addEventListener('darkModeChanged', function() {
        initAdvancedCart();
    });
});

/**
 * Initialize advanced cart functionality
 */
function initAdvancedCart() {
    console.log('Initializing advanced cart');
    
    // Initialize add to cart buttons
    initAddToCartButtons();
    
    // Initialize mini cart
    initMiniCart();
    
    // Initialize cart page
    initCartPage();
    
    // Update cart counter
    updateCartCounter();
}

/**
 * Initialize add to cart buttons
 */
function initAddToCartButtons() {
    // Get all add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        // Skip if already initialized
        if (button.getAttribute('data-cart-initialized')) return;
        
        // Mark as initialized
        button.setAttribute('data-cart-initialized', 'true');
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product ID
            const productId = this.getAttribute('data-product-id');
            
            // Get product details
            const product = getProductDetails(productId, this);
            
            // Add to cart
            addToCart(product, this);
        });
    });
}

/**
 * Get product details from DOM
 * @param {string} productId - The product ID
 * @param {Element} button - The add to cart button
 * @returns {Object} Product details
 */
function getProductDetails(productId, button) {
    // Get product card or container
    const productContainer = button.closest('.product-card') || button.closest('.product-detail');
    
    if (productContainer) {
        // Get product details from container
        const title = productContainer.querySelector('.card-title, .product-title')?.textContent || 'Product';
        const price = productContainer.querySelector('.card-price, .product-price')?.textContent?.replace('₹', '') || '0';
        const image = productContainer.querySelector('.card-img-top, .product-image img')?.src || '/static/img/placeholder.jpg';
        
        // Get quantity if available
        const quantityInput = productContainer.querySelector('.quantity-input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        return {
            id: productId,
            title,
            price,
            image,
            quantity
        };
    }
    
    // Default product details
    return {
        id: productId,
        title: 'Product',
        price: '0',
        image: '/static/img/placeholder.jpg',
        quantity: 1
    };
}

/**
 * Add product to cart
 * @param {Object} product - The product details
 * @param {Element} button - The add to cart button
 */
function addToCart(product, button) {
    // Show loading state
    button.classList.add('loading');
    button.innerHTML = '<span class="spinner"></span> Adding...';
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Get current cart
            let cart = getCart();
            
            // Check if product already in cart
            const existingProductIndex = cart.findIndex(item => item.id === product.id);
            
            if (existingProductIndex !== -1) {
                // Update quantity
                cart[existingProductIndex].quantity += product.quantity;
            } else {
                // Add new product
                cart.push(product);
            }
            
            // Save cart to localStorage
            localStorage.setItem('varnikakart-cart', JSON.stringify(cart));
            
            // Update button state
            button.classList.remove('loading');
            button.classList.add('added');
            button.innerHTML = '<i class="fas fa-check"></i> Added';
            
            // Reset button after delay
            setTimeout(() => {
                button.classList.remove('added');
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            }, 2000);
            
            // Update cart counter
            updateCartCounter();
            
            // Update mini cart
            updateMiniCart();
            
            // Show mini cart
            showMiniCart();
            
            // Show toast notification
            showToast('Product added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            
            // Reset button
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            
            // Show error toast
            showToast('Error adding to cart', 'error');
        }
    }, 800);
}

/**
 * Get cart from localStorage
 * @returns {Array} Cart array
 */
function getCart() {
    try {
        // Get cart from localStorage
        const cart = localStorage.getItem('varnikakart-cart');
        
        // Parse cart or return empty array
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error getting cart:', error);
        return [];
    }
}

/**
 * Update cart counter
 */
function updateCartCounter() {
    // Get cart
    const cart = getCart();
    
    // Calculate total quantity
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Get all cart counters
    const counters = document.querySelectorAll('.cart-counter');
    
    counters.forEach(counter => {
        // Update counter text
        counter.textContent = totalQuantity;
        
        // Show/hide counter
        if (totalQuantity > 0) {
            counter.classList.add('show');
        } else {
            counter.classList.remove('show');
        }
    });
}

/**
 * Initialize mini cart
 */
function initMiniCart() {
    // Get mini cart
    let miniCart = document.querySelector('.mini-cart');
    
    if (!miniCart) {
        // Create mini cart
        createMiniCart();
    } else {
        // Update mini cart
        updateMiniCart();
    }
    
    // Get cart button
    const cartButton = document.querySelector('.cart-btn');
    
    if (cartButton) {
        // Skip if already initialized
        if (cartButton.getAttribute('data-mini-cart-initialized')) return;
        
        // Mark as initialized
        cartButton.setAttribute('data-mini-cart-initialized', 'true');
        
        // Add click event listener
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show mini cart
            showMiniCart();
        });
    }
}

/**
 * Create mini cart
 */
function createMiniCart() {
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'mini-cart-backdrop';
    
    // Create mini cart
    const miniCart = document.createElement('div');
    miniCart.className = 'mini-cart';
    
    // Create mini cart content
    miniCart.innerHTML = `
        <div class="mini-cart-header">
            <div>
                <span class="mini-cart-title">Shopping Cart</span>
                <span class="mini-cart-count">(0)</span>
            </div>
            <button class="mini-cart-close">&times;</button>
        </div>
        <div class="mini-cart-content"></div>
        <div class="mini-cart-footer">
            <div class="mini-cart-subtotal">
                <span class="mini-cart-subtotal-label">Subtotal:</span>
                <span class="mini-cart-subtotal-value">₹0</span>
            </div>
            <div class="mini-cart-actions">
                <a href="/cart/" class="mini-cart-view-cart">View Cart</a>
                <a href="/checkout/" class="mini-cart-checkout">Checkout</a>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(backdrop);
    document.body.appendChild(miniCart);
    
    // Add event listeners
    const closeButton = miniCart.querySelector('.mini-cart-close');
    
    // Close button
    closeButton.addEventListener('click', function() {
        hideMiniCart();
    });
    
    // Backdrop
    backdrop.addEventListener('click', function() {
        hideMiniCart();
    });
    
    // Update mini cart
    updateMiniCart();
}

/**
 * Update mini cart
 */
function updateMiniCart() {
    // Get mini cart
    const miniCart = document.querySelector('.mini-cart');
    
    if (!miniCart) return;
    
    // Get cart
    const cart = getCart();
    
    // Update count
    const countElement = miniCart.querySelector('.mini-cart-count');
    if (countElement) {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        countElement.textContent = `(${totalQuantity})`;
    }
    
    // Get content container
    const content = miniCart.querySelector('.mini-cart-content');
    
    if (!content) return;
    
    // Clear content
    content.innerHTML = '';
    
    // Check if cart is empty
    if (cart.length === 0) {
        // Show empty cart message
        content.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3 class="empty-cart-title">Your cart is empty</h3>
                <p class="empty-cart-text">You haven't added any products to your cart yet.</p>
                <a href="/products/" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
    } else {
        // Add items to mini cart
        cart.forEach(item => {
            // Create item element
            const itemElement = document.createElement('div');
            itemElement.className = 'mini-cart-item';
            
            // Create item content
            itemElement.innerHTML = `
                <div class="mini-cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="mini-cart-item-content">
                    <div class="mini-cart-item-title">${item.title}</div>
                    <div class="mini-cart-item-price">₹${item.price}</div>
                    <div class="mini-cart-item-quantity">
                        <button class="quantity-btn quantity-decrease" data-product-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-product-id="${item.id}">
                        <button class="quantity-btn quantity-increase" data-product-id="${item.id}">+</button>
                        <button class="mini-cart-item-remove" data-product-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
            
            // Add to content
            content.appendChild(itemElement);
            
            // Add event listeners
            const decreaseBtn = itemElement.querySelector('.quantity-decrease');
            const increaseBtn = itemElement.querySelector('.quantity-increase');
            const quantityInput = itemElement.querySelector('.quantity-input');
            const removeBtn = itemElement.querySelector('.mini-cart-item-remove');
            
            // Decrease button
            decreaseBtn.addEventListener('click', function() {
                // Get product ID
                const productId = this.getAttribute('data-product-id');
                
                // Update quantity
                updateCartItemQuantity(productId, -1);
            });
            
            // Increase button
            increaseBtn.addEventListener('click', function() {
                // Get product ID
                const productId = this.getAttribute('data-product-id');
                
                // Update quantity
                updateCartItemQuantity(productId, 1);
            });
            
            // Quantity input
            quantityInput.addEventListener('change', function() {
                // Get product ID
                const productId = this.getAttribute('data-product-id');
                
                // Get new quantity
                const newQuantity = parseInt(this.value);
                
                // Update quantity directly
                updateCartItemQuantity(productId, 0, newQuantity);
            });
            
            // Remove button
            removeBtn.addEventListener('click', function() {
                // Get product ID
                const productId = this.getAttribute('data-product-id');
                
                // Remove from cart
                removeFromCart(productId);
            });
        });
    }
    
    // Update subtotal
    const subtotalElement = miniCart.querySelector('.mini-cart-subtotal-value');
    if (subtotalElement) {
        const subtotal = calculateSubtotal(cart);
        subtotalElement.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }
}

/**
 * Show mini cart
 */
function showMiniCart() {
    // Get mini cart and backdrop
    const miniCart = document.querySelector('.mini-cart');
    const backdrop = document.querySelector('.mini-cart-backdrop');
    
    if (!miniCart || !backdrop) return;
    
    // Show mini cart and backdrop
    miniCart.classList.add('show');
    backdrop.classList.add('show');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Hide mini cart
 */
function hideMiniCart() {
    // Get mini cart and backdrop
    const miniCart = document.querySelector('.mini-cart');
    const backdrop = document.querySelector('.mini-cart-backdrop');
    
    if (!miniCart || !backdrop) return;
    
    // Hide mini cart and backdrop
    miniCart.classList.remove('show');
    backdrop.classList.remove('show');
    
    // Allow body scrolling
    document.body.style.overflow = '';
}

/**
 * Update cart item quantity
 * @param {string} productId - The product ID
 * @param {number} change - The quantity change (-1, 0, or 1)
 * @param {number} newQuantity - The new quantity (optional)
 */
function updateCartItemQuantity(productId, change, newQuantity) {
    try {
        // Get current cart
        let cart = getCart();
        
        // Find product in cart
        const productIndex = cart.findIndex(item => item.id === productId);
        
        if (productIndex !== -1) {
            // Get current quantity
            let quantity = cart[productIndex].quantity;
            
            if (change !== 0) {
                // Update quantity by change
                quantity += change;
            } else if (newQuantity !== undefined) {
                // Set to new quantity
                quantity = newQuantity;
            }
            
            // Ensure quantity is at least 1
            quantity = Math.max(1, quantity);
            
            // Update quantity
            cart[productIndex].quantity = quantity;
            
            // Save cart to localStorage
            localStorage.setItem('varnikakart-cart', JSON.stringify(cart));
            
            // Update mini cart
            updateMiniCart();
            
            // Update cart counter
            updateCartCounter();
            
            // Update cart page if on cart page
            updateCartPage();
        }
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        
        // Show error toast
        showToast('Error updating quantity', 'error');
    }
}

/**
 * Remove product from cart
 * @param {string} productId - The product ID
 */
function removeFromCart(productId) {
    try {
        // Get current cart
        let cart = getCart();
        
        // Remove product from cart
        cart = cart.filter(item => item.id !== productId);
        
        // Save cart to localStorage
        localStorage.setItem('varnikakart-cart', JSON.stringify(cart));
        
        // Update mini cart
        updateMiniCart();
        
        // Update cart counter
        updateCartCounter();
        
        // Update cart page if on cart page
        updateCartPage();
        
        // Show toast notification
        showToast('Product removed from cart');
    } catch (error) {
        console.error('Error removing from cart:', error);
        
        // Show error toast
        showToast('Error removing product', 'error');
    }
}

/**
 * Calculate subtotal
 * @param {Array} cart - The cart array
 * @returns {number} Subtotal
 */
function calculateSubtotal(cart) {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/,/g, ''));
        return total + (price * item.quantity);
    }, 0);
}

/**
 * Initialize cart page
 */
function initCartPage() {
    // Check if on cart page
    const cartContainer = document.querySelector('.cart-container');
    
    if (cartContainer) {
        // Update cart page
        updateCartPage();
        
        // Get clear cart button
        const clearButton = cartContainer.querySelector('.cart-clear');
        
        if (clearButton) {
            // Add click event listener
            clearButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear cart
                clearCart();
                
                // Update cart page
                updateCartPage();
                
                // Update cart counter
                updateCartCounter();
                
                // Show toast notification
                showToast('Cart cleared');
            });
        }
        
        // Get continue shopping button
        const continueButton = cartContainer.querySelector('.cart-continue-shopping');
        
        if (continueButton) {
            // Add click event listener
            continueButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Navigate to products page
                window.location.href = '/products/';
            });
        }
    }
}

/**
 * Update cart page
 */
function updateCartPage() {
    // Check if on cart page
    const cartContainer = document.querySelector('.cart-container');
    
    if (!cartContainer) return;
    
    // Get cart
    const cart = getCart();
    
    // Get cart table body
    const cartTableBody = cartContainer.querySelector('.cart-table tbody');
    
    if (cartTableBody) {
        // Clear table body
        cartTableBody.innerHTML = '';
        
        // Check if cart is empty
        if (cart.length === 0) {
            // Show empty cart message
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <h3 class="empty-cart-title">Your cart is empty</h3>
                            <p class="empty-cart-text">You haven't added any products to your cart yet.</p>
                            <a href="/products/" class="btn btn-primary">Continue Shopping</a>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            // Add items to cart table
            cart.forEach(item => {
                // Calculate item total
                const price = parseFloat(item.price.replace(/,/g, ''));
                const total = price * item.quantity;
                
                // Create table row
                const row = document.createElement('tr');
                
                // Create row content
                row.innerHTML = `
                    <td>
                        <div class="cart-product-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                    </td>
                    <td class="cart-product-title">${item.title}</td>
                    <td class="cart-product-price">₹${item.price}</td>
                    <td>
                        <div class="cart-product-quantity">
                            <button class="quantity-btn quantity-decrease" data-product-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-product-id="${item.id}">
                            <button class="quantity-btn quantity-increase" data-product-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td class="cart-product-total">₹${total.toLocaleString('en-IN')}</td>
                    <td>
                        <button class="cart-product-remove" data-product-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                
                // Add to table body
                cartTableBody.appendChild(row);
                
                // Add event listeners
                const decreaseBtn = row.querySelector('.quantity-decrease');
                const increaseBtn = row.querySelector('.quantity-increase');
                const quantityInput = row.querySelector('.quantity-input');
                const removeBtn = row.querySelector('.cart-product-remove');
                
                // Decrease button
                decreaseBtn.addEventListener('click', function() {
                    // Get product ID
                    const productId = this.getAttribute('data-product-id');
                    
                    // Update quantity
                    updateCartItemQuantity(productId, -1);
                });
                
                // Increase button
                increaseBtn.addEventListener('click', function() {
                    // Get product ID
                    const productId = this.getAttribute('data-product-id');
                    
                    // Update quantity
                    updateCartItemQuantity(productId, 1);
                });
                
                // Quantity input
                quantityInput.addEventListener('change', function() {
                    // Get product ID
                    const productId = this.getAttribute('data-product-id');
                    
                    // Get new quantity
                    const newQuantity = parseInt(this.value);
                    
                    // Update quantity directly
                    updateCartItemQuantity(productId, 0, newQuantity);
                });
                
                // Remove button
                removeBtn.addEventListener('click', function() {
                    // Get product ID
                    const productId = this.getAttribute('data-product-id');
                    
                    // Remove from cart
                    removeFromCart(productId);
                });
            });
        }
    }
    
    // Update cart summary
    updateCartSummary(cart);
}

/**
 * Update cart summary
 * @param {Array} cart - The cart array
 */
function updateCartSummary(cart) {
    // Get cart summary
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartSummary) return;
    
    // Calculate subtotal
    const subtotal = calculateSubtotal(cart);
    
    // Calculate shipping (free over ₹1000)
    const shipping = subtotal > 1000 ? 0 : 100;
    
    // Calculate total
    const total = subtotal + shipping;
    
    // Update subtotal
    const subtotalElement = cartSummary.querySelector('.cart-summary-subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }
    
    // Update shipping
    const shippingElement = cartSummary.querySelector('.cart-summary-shipping');
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`;
    }
    
    // Update total
    const totalElement = cartSummary.querySelector('.cart-summary-total-value');
    if (totalElement) {
        totalElement.textContent = `₹${total.toLocaleString('en-IN')}`;
    }
    
    // Update checkout button
    const checkoutButton = cartSummary.querySelector('.cart-checkout-btn');
    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}

/**
 * Clear cart
 */
function clearCart() {
    try {
        // Clear cart in localStorage
        localStorage.setItem('varnikakart-cart', JSON.stringify([]));
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
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
