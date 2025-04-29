// Main JavaScript for VarnikaKart

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle theme changes
    document.addEventListener('themeChanged', function(e) {
        console.log('Theme changed to:', e.detail.theme);

        // Update logo gradient based on theme
        const logo = document.querySelector('.navbar-brand');
        const theme = e.detail.theme;

        if (theme === 'artisanal-elegance') {
            logo.style.background = 'linear-gradient(90deg, #d4a5a5, #a5a6d4)';
        } else if (theme === 'boho-brush') {
            logo.style.background = 'linear-gradient(90deg, #c77d5e, #8ba888)';
        } else if (theme === 'modern-minimal') {
            logo.style.background = 'linear-gradient(90deg, #4361ee, #f72585)';
        } else if (theme === 'mystic-indian') {
            logo.style.background = 'linear-gradient(90deg, #9c0e0e, #f1c40f)';
        } else if (theme === 'pastel-dream') {
            logo.style.background = 'linear-gradient(90deg, #ffafcc, #a2d2ff)';
        }

        // Apply the same gradient to footer logo
        const footerLogo = document.querySelector('footer h5.fw-bold');
        if (footerLogo) {
            footerLogo.style.background = logo.style.background;
        }
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const quantity = document.querySelector(`#quantity-${productId}`) ?
                             document.querySelector(`#quantity-${productId}`).value : 1;

            // AJAX call to add item to cart
            fetch('/cart/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    'product_id': productId,
                    'quantity': quantity
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update cart count
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        cartCount.textContent = data.cart_count;
                    }

                    // Show success message
                    showMessage('Item added to cart successfully!', 'success');
                } else {
                    showMessage('Failed to add item to cart.', 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('An error occurred. Please try again.', 'danger');
            });
        });
    });

    // Add to wishlist functionality
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');

            // AJAX call to add item to wishlist
            fetch('/wishlist/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    'product_id': productId
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Toggle wishlist icon
                    this.querySelector('i').classList.toggle('far');
                    this.querySelector('i').classList.toggle('fas');

                    // Show success message
                    showMessage('Item added to wishlist successfully!', 'success');
                } else {
                    showMessage('Failed to add item to wishlist.', 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('An error occurred. Please try again.', 'danger');
            });
        });
    });

    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Helper function to show messages
    function showMessage(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                alertDiv.remove();
            }, 150);
        }, 3000);
    }
});
