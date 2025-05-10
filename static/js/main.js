// Main JavaScript for VarnikaKart

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle fixed navbar on scroll with smooth transition
    const mainNav = document.querySelector('.pro-navbar');
    const categoryNav = document.querySelector('.category-navbar');
    const topBarHeight = document.querySelector('.top-bar') ? document.querySelector('.top-bar').offsetHeight : 0;
    let isFixed = false;
    let lastScrollTop = 0;
    let scrollTimer;
    let hideNavbarTimer;
    let navbarHeight = mainNav ? mainNav.offsetHeight : 0;

    // Function to handle scroll behavior
    function handleScroll() {
        const currentScrollTop = window.scrollY;

        // Determine scroll direction
        const isScrollingDown = currentScrollTop > lastScrollTop;

        // Fixed navbar logic
        if (currentScrollTop > topBarHeight) {
            if (!isFixed) {
                mainNav.classList.add('navbar-fixed');
                if (categoryNav) {
                    categoryNav.style.marginTop = navbarHeight + 'px';
                    categoryNav.classList.add('category-navbar-fixed');
                }
                document.body.style.paddingTop = navbarHeight + 'px';
                isFixed = true;
            }
        } else {
            if (isFixed) {
                mainNav.classList.remove('navbar-fixed');
                if (categoryNav) {
                    categoryNav.style.marginTop = '0';
                    categoryNav.classList.remove('category-navbar-fixed');
                }
                document.body.style.paddingTop = '0';
                isFixed = false;
            }
        }

        // Auto-hide navbar when scrolling down (optional feature)
        // if (isScrollingDown && currentScrollTop > 300) {
        //     if (mainNav.classList.contains('navbar-visible')) {
        //         mainNav.classList.remove('navbar-visible');
        //         mainNav.classList.add('navbar-hidden');
        //     }
        // } else {
        //     if (mainNav.classList.contains('navbar-hidden')) {
        //         mainNav.classList.remove('navbar-hidden');
        //         mainNav.classList.add('navbar-visible');
        //     }
        // }

        // Update last scroll position
        lastScrollTop = currentScrollTop;
    }

    // Throttle scroll event for better performance
    window.addEventListener('scroll', function() {
        if (!scrollTimer) {
            scrollTimer = setTimeout(function() {
                handleScroll();
                scrollTimer = null;
            }, 10);
        }
    });

    // Initialize on page load
    handleScroll();

    // Handle dropdown menus on hover for desktop
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

    dropdownItems.forEach(item => {
        const dropdownMenu = item.querySelector('.dropdown-menu');
        
        if (window.innerWidth >= 992) { // Only for desktop
            item.addEventListener('mouseenter', function() {
                // Close any other open menus first
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    if (menu !== dropdownMenu) menu.classList.remove('show');
                });
                dropdownMenu.classList.add('show');
            });
            
            item.addEventListener('mouseleave', function() {
                dropdownMenu.classList.remove('show');
            });
        }
    });

    // Handle mega menu on mobile
    const megaMenuItems = document.querySelectorAll('.nav-item');

    megaMenuItems.forEach(item => {
        if (window.innerWidth < 992) { // Only for mobile
            const link = item.querySelector('.nav-link');
            const megaMenu = item.querySelector('.mega-menu');

            if (link && megaMenu) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth < 992) {
                        e.preventDefault();
                        item.classList.toggle('show');
                    }
                });
            }
        }
    });

    // Enhanced Search autocomplete functionality
    const searchInput = document.querySelector('.search-input');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const searchSuggestions = document.querySelector('.search-suggestions');

    if (searchInput) {
        // Add placeholder animation
        const originalPlaceholder = searchInput.getAttribute('placeholder');
        const placeholders = [
            'Search for paintings...',
            'Search for jewelry...',
            'Search for home decor...',
            'Search for gifts...',
            originalPlaceholder
        ];
        let placeholderIndex = 0;

        // Animate placeholder text
        function animatePlaceholder() {
            searchInput.setAttribute('placeholder', placeholders[placeholderIndex]);
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        }

        // Start placeholder animation after 3 seconds
        setTimeout(() => {
            setInterval(animatePlaceholder, 2000);
        }, 3000);

        // Show suggestions on focus
        searchInput.addEventListener('focus', function() {
            if (searchSuggestions) {
                searchSuggestions.classList.add('active');

                // Add header and footer to search suggestions if they don't exist
                if (!searchSuggestions.querySelector('.search-suggestions-header')) {
                    const header = document.createElement('div');
                    header.className = 'search-suggestions-header';
                    header.innerHTML = `
                        <div class="search-suggestions-title">Popular Searches</div>
                        <div class="search-suggestions-clear">Clear All</div>
                    `;
                    searchSuggestions.prepend(header);

                    // Add footer
                    const footer = document.createElement('div');
                    footer.className = 'search-suggestions-footer';
                    footer.innerHTML = `
                        <a href="/products/search/">View all results <i class="fas fa-arrow-right"></i></a>
                    `;
                    searchSuggestions.appendChild(footer);

                    // Add event listener to clear button
                    const clearBtn = header.querySelector('.search-suggestions-clear');
                    clearBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        searchInput.value = '';
                        searchSuggestions.classList.remove('active');
                    });
                }
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (searchSuggestions && searchInput && !searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.remove('active');
            }
        });

        // Enhanced search functionality
        searchInput.addEventListener('input', function() {
            // Here you would typically make an AJAX call to get search results
            // For demo purposes, we're just showing/hiding the results
            if (this.value.length > 0) {
                if (searchSuggestions) {
                    searchSuggestions.classList.add('active');

                    // Update header title
                    const header = searchSuggestions.querySelector('.search-suggestions-header');
                    if (header) {
                        const title = header.querySelector('.search-suggestions-title');
                        title.textContent = `Results for "${this.value}"`;
                    }
                }
            } else {
                if (searchSuggestions) {
                    // Reset header title
                    const header = searchSuggestions.querySelector('.search-suggestions-header');
                    if (header) {
                        const title = header.querySelector('.search-suggestions-title');
                        title.textContent = 'Popular Searches';
                    }
                }
            }
        });

        // Add keyboard navigation for search results
        searchInput.addEventListener('keydown', function(e) {
            if (searchSuggestions && searchSuggestions.classList.contains('active')) {
                const items = searchSuggestions.querySelectorAll('.suggestion-item');
                let focusedItem = searchSuggestions.querySelector('.suggestion-item.focused');
                let focusedIndex = -1;

                if (focusedItem) {
                    focusedIndex = Array.from(items).indexOf(focusedItem);
                }

                // Down arrow
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (focusedIndex < items.length - 1) {
                        if (focusedItem) focusedItem.classList.remove('focused');
                        items[focusedIndex + 1].classList.add('focused');
                        items[focusedIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }

                // Up arrow
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (focusedIndex > 0) {
                        if (focusedItem) focusedItem.classList.remove('focused');
                        items[focusedIndex - 1].classList.add('focused');
                        items[focusedIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }

                // Enter key
                if (e.key === 'Enter' && focusedItem) {
                    e.preventDefault();
                    window.location.href = focusedItem.getAttribute('data-url') || '/products/search/?q=' + encodeURIComponent(searchInput.value);
                }

                // Escape key
                if (e.key === 'Escape') {
                    searchSuggestions.classList.remove('active');
                    searchInput.blur();
                }
            }
        });
    }

    // Notification system
    const notificationBadges = document.querySelectorAll('.notification-badge');
    const markAllAsReadBtn = document.querySelector('.dropdown-menu button.text-primary');

    if (markAllAsReadBtn) {
        markAllAsReadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Remove unread class from all notifications
            const unreadItems = document.querySelectorAll('.notifications-list .unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });

            // Hide notification badges
            notificationBadges.forEach(badge => {
                badge.classList.remove('show');
            });
        });
    }

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
