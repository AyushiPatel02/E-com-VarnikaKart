/**
 * Cute Menubar JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add animation to brand icon
    const brandIcon = document.querySelector('.navbar-brand i');
    if (brandIcon) {
        brandIcon.classList.add('fa-bounce');
        setTimeout(() => {
            brandIcon.classList.remove('fa-bounce');
        }, 1000);

        // Add hover animation
        const navbarBrand = document.querySelector('.navbar-brand');
        navbarBrand.addEventListener('mouseenter', function() {
            brandIcon.classList.add('fa-spin');
            setTimeout(() => {
                brandIcon.classList.remove('fa-spin');
            }, 500);
        });
    }

    // Initialize dropdown menus with cute animation
    const dropdownToggleList = document.querySelectorAll('.dropdown-toggle');
    dropdownToggleList.forEach(function(dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentNode;
            parent.classList.toggle('show');
            const dropdownMenu = parent.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                if (!dropdownMenu.classList.contains('show')) {
                    // Add animation before showing
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.transform = 'translateY(10px)';
                    dropdownMenu.classList.add('show');
                    setTimeout(() => {
                        dropdownMenu.style.opacity = '1';
                        dropdownMenu.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    // Add animation before hiding
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        dropdownMenu.classList.remove('show');
                    }, 300);
                }
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.nav-item.dropdown');
        dropdowns.forEach(function(dropdown) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        dropdownMenu.classList.remove('show');
                    }, 300);
                }
            }
        });
    });

    // Mobile menu toggle with cute animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
                if (!target.classList.contains('show')) {
                    target.style.opacity = '0';
                    target.classList.add('show');
                    setTimeout(() => {
                        target.style.opacity = '1';
                    }, 10);
                } else {
                    target.style.opacity = '0';
                    setTimeout(() => {
                        target.classList.remove('show');
                    }, 300);
                }
            }
        });
    }

    // Add cute shadow to navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 10) {
                navbar.classList.add('navbar-scrolled');
                navbar.style.boxShadow = '0 5px 15px rgba(255, 107, 107, 0.2)';
            } else {
                navbar.classList.remove('navbar-scrolled');
                navbar.style.boxShadow = '';
            }
        }
    });

    // Search form functionality with cute animation
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        const searchInput = searchForm.querySelector('input[type="search"]');
        const searchButton = searchForm.querySelector('button');

        // Add focus animation
        if (searchInput) {
            searchInput.addEventListener('focus', function() {
                searchButton.style.backgroundColor = '#4ecdc4';
                searchButton.style.borderColor = '#4ecdc4';
            });

            searchInput.addEventListener('blur', function() {
                searchButton.style.backgroundColor = '';
                searchButton.style.borderColor = '';
            });
        }

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (searchInput && searchInput.value.trim() !== '') {
                // Add cute search animation
                const searchIcon = searchButton.querySelector('i');
                searchIcon.className = 'fas fa-spinner fa-spin';
                setTimeout(() => {
                    searchIcon.className = 'fas fa-search';
                    // Implement search functionality here
                    console.log('Searching for cute items:', searchInput.value);
                    // You can redirect to a search results page
                    // window.location.href = '/search?q=' + encodeURIComponent(searchInput.value);
                }, 800);
            }
        });
    }

    // Add cute hover effects to icons
    const navIcons = document.querySelectorAll('.nav-link i, .dropdown-item i');
    navIcons.forEach(icon => {
        icon.parentElement.addEventListener('mouseenter', function() {
            icon.classList.add('fa-bounce');
            setTimeout(() => {
                icon.classList.remove('fa-bounce');
            }, 1000);
        });
    });

    // Add cute animation to action buttons
    const actionButtons = document.querySelectorAll('.btn-outline-primary');
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.add('fa-beat');
                setTimeout(() => {
                    icon.classList.remove('fa-beat');
                }, 500);
            }
        });
    });
});
