/**
 * Creative and Unique Menubar JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Creative menubar loaded');

    // Add animation to brand icon on page load
    const brandIcon = document.querySelector('.navbar-brand i');
    if (brandIcon) {
        setTimeout(() => {
            brandIcon.style.transition = 'transform 0.5s ease';
            brandIcon.style.transform = 'rotate(15deg)';
            setTimeout(() => {
                brandIcon.style.transform = 'rotate(0deg)';
            }, 500);
        }, 1000);

        // Add hover animation
        const navbarBrand = document.querySelector('.navbar-brand');
        navbarBrand.addEventListener('mouseenter', function() {
            brandIcon.style.transform = 'rotate(15deg)';
        });

        navbarBrand.addEventListener('mouseleave', function() {
            brandIcon.style.transform = 'rotate(0deg)';
        });
    }

    // Add hover effects to nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const icon = link.querySelector('i');
        if (icon) {
            link.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.2)';
            });

            link.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1)';
            });
        }
    });

    // Add hover effects to dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        const icon = item.querySelector('i');
        if (icon) {
            item.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.2)';
                item.style.paddingLeft = '25px';
            });

            item.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1)';
                item.style.paddingLeft = '20px';
            });
        }
    });

    // Add animation to action buttons
    const actionButtons = document.querySelectorAll('.btn-outline-primary');
    actionButtons.forEach(button => {
        const icon = button.querySelector('i');
        if (icon) {
            button.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.2)';
            });

            button.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1)';
            });
        }
    });

    // Add shadow to navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 10) {
                navbar.style.boxShadow = '0 5px 20px rgba(255, 107, 107, 0.2)';
                navbar.style.background = 'linear-gradient(135deg, #fff6f6, #f9f7f7, #f0f9ff)';
            } else {
                navbar.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.15)';
                navbar.style.background = 'linear-gradient(135deg, #fff6f6, #f9f7f7, #f0f9ff)';
            }
        }
    });

    // Add animation to search form
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        const searchInput = searchForm.querySelector('input[type="search"]');
        const searchButton = searchForm.querySelector('button');

        if (searchInput) {
            searchInput.addEventListener('focus', function() {
                this.style.boxShadow = '0 0 0 3px rgba(255, 190, 118, 0.2)';
                if (searchButton) {
                    searchButton.style.backgroundColor = '#4ecdc4';
                    searchButton.style.borderColor = '#4ecdc4';
                }
            });

            searchInput.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
                if (searchButton) {
                    searchButton.style.backgroundColor = '';
                    searchButton.style.borderColor = '';
                }
            });
        }
    }

    // Add rainbow effect to navbar border on hover
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.addEventListener('mouseenter', function() {
            const border = this.querySelector('.navbar::before');
            if (border) {
                border.style.animation = 'rainbow 2s linear infinite';
            }
        });
    }
});
