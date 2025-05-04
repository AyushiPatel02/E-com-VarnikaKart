// Enhanced User Menu Dropdown Functionality

document.addEventListener('DOMContentLoaded', function() {
    // User menu toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.querySelector('.user-menu');
    const cartBtn = document.querySelector('.action-btn[title="Cart"]');
    const wishlistBtn = document.querySelector('.action-btn[title="Wishlist"]');

    // Handle user menu toggle
    if (userMenuBtn && userMenu) {
        // Toggle on click
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();

            // Close any other open menus first
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });

            userMenu.classList.toggle('active');

            // Add active state to button
            if (userMenu.classList.contains('active')) {
                userMenuBtn.classList.add('active');
                userMenuBtn.style.color = 'var(--primary-color)';
                userMenuBtn.style.transform = 'translateY(-3px)';
            } else {
                userMenuBtn.classList.remove('active');
                userMenuBtn.style.color = '';
                userMenuBtn.style.transform = '';
            }
        });

        // Optional: Toggle on hover for desktop
        if (window.innerWidth >= 992) {
            userMenuBtn.addEventListener('mouseenter', function() {
                userMenu.classList.add('active');
                userMenuBtn.classList.add('active');
                userMenuBtn.style.color = 'var(--primary-color)';
                userMenuBtn.style.transform = 'translateY(-3px)';
            });

            userMenu.addEventListener('mouseleave', function() {
                userMenu.classList.remove('active');
                userMenuBtn.classList.remove('active');
                userMenuBtn.style.color = '';
                userMenuBtn.style.transform = '';
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove('active');
                userMenuBtn.classList.remove('active');
                userMenuBtn.style.color = '';
                userMenuBtn.style.transform = '';
            }
        });
    }

    // Direct navigation for cart and wishlist buttons
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            window.location.href = '/cart/';
        });
    }

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            window.location.href = '/wishlist/';
        });
    }

    // Add hover effects to all action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.color = 'var(--primary-color)';
        });

        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.color = '';
            }
        });
    });
});
