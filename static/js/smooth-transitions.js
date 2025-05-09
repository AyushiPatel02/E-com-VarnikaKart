/**
 * Smooth Transitions for VarnikaKart
 * Enhanced page transitions and smooth animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth transitions
    initSmoothTransitions();
    
    // Listen for theme changes to reinitialize
    document.addEventListener('themeChanged', function() {
        initSmoothTransitions();
    });
    
    // Listen for dark mode changes to reinitialize
    document.addEventListener('darkModeChanged', function() {
        initSmoothTransitions();
    });
});

/**
 * Initialize smooth transitions
 */
function initSmoothTransitions() {
    console.log('Initializing smooth transitions');
    
    // Apply page transition classes
    applyPageTransitions();
    
    // Initialize section transitions
    initSectionTransitions();
    
    // Initialize staggered transitions
    initStaggeredTransitions();
    
    // Initialize navigation transitions
    initNavigationTransitions();
    
    // Initialize button transitions
    initButtonTransitions();
    
    // Initialize card transitions
    initCardTransitions();
    
    // Initialize form transitions
    initFormTransitions();
    
    // Initialize modal transitions
    initModalTransitions();
    
    // Initialize accordion transitions
    initAccordionTransitions();
    
    // Initialize tab transitions
    initTabTransitions();
}

/**
 * Apply page transition classes
 */
function applyPageTransitions() {
    // Get main content element
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Add page transition class based on page type
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index.html') {
        // Home page
        mainContent.classList.add('page-fade-in');
    } else if (path.includes('/product/') || path.includes('/category/')) {
        // Product or category page
        mainContent.classList.add('page-slide-up');
    } else if (path.includes('/cart/') || path.includes('/checkout/')) {
        // Cart or checkout page
        mainContent.classList.add('page-slide-in-right');
    } else if (path.includes('/account/') || path.includes('/profile/')) {
        // Account or profile page
        mainContent.classList.add('page-slide-in-left');
    } else {
        // Default transition
        mainContent.classList.add('page-zoom-in');
    }
}

/**
 * Initialize section transitions
 */
function initSectionTransitions() {
    // Get all sections with transition class
    const sections = document.querySelectorAll('.section-transition');
    
    // Create intersection observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });
    
    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Add transition classes to sections that don't have them
    const allSections = document.querySelectorAll('section:not(.section-transition)');
    allSections.forEach((section, index) => {
        // Skip if already has transition class
        if (section.classList.contains('section-transition')) return;
        
        // Add transition class
        section.classList.add('section-transition');
        
        // Add direction class based on index
        if (index % 3 === 0) {
            section.classList.add('section-from-bottom');
        } else if (index % 3 === 1) {
            section.classList.add('section-from-left');
        } else {
            section.classList.add('section-from-right');
        }
        
        // Observe section
        sectionObserver.observe(section);
    });
}

/**
 * Initialize staggered transitions
 */
function initStaggeredTransitions() {
    // Get all stagger containers
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    staggerContainers.forEach(container => {
        // Get all items in container
        const items = container.querySelectorAll(':scope > *');
        
        // Add stagger classes
        items.forEach((item, index) => {
            item.classList.add('stagger-item');
            
            // Add delay class based on index
            const delayClass = `stagger-delay-${Math.min(index + 1, 8)}`;
            item.classList.add(delayClass);
        });
        
        // Create intersection observer
        const staggerObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Add visible class to all items with delay
                items.forEach(item => {
                    item.classList.add('visible');
                });
                
                // Unobserve container
                staggerObserver.unobserve(container);
            }
        }, {
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });
        
        // Observe container
        staggerObserver.observe(container);
    });
    
    // Add stagger container class to product containers
    const productContainers = document.querySelectorAll('.products-container .row');
    productContainers.forEach(container => {
        if (!container.classList.contains('stagger-container')) {
            container.classList.add('stagger-container');
            initStaggeredTransitions(); // Reinitialize for this container
        }
    });
}

/**
 * Initialize navigation transitions
 */
function initNavigationTransitions() {
    // Add transition class to nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.add('nav-item-transition');
    });
    
    // Add transition class to dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.classList.add('nav-dropdown');
    });
    
    // Add event listeners to dropdown toggles
    const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const dropdown = this.nextElementSibling;
            if (dropdown && dropdown.classList.contains('nav-dropdown')) {
                dropdown.classList.toggle('show');
            }
        });
    });
}

/**
 * Initialize button transitions
 */
function initButtonTransitions() {
    // Add transition class to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.add('btn-transition');
    });
}

/**
 * Initialize card transitions
 */
function initCardTransitions() {
    // Add transition class to cards
    const cards = document.querySelectorAll('.card, .product-card, .feature-card');
    cards.forEach(card => {
        card.classList.add('card-transition');
        
        // Add transition class to card image
        const imgContainer = card.querySelector('.card-img-top, .card-img');
        if (imgContainer) {
            imgContainer.parentElement.classList.add('card-img-transition');
        }
    });
}

/**
 * Initialize form transitions
 */
function initFormTransitions() {
    // Add transition class to form controls
    const formControls = document.querySelectorAll('.form-control, .form-select');
    formControls.forEach(control => {
        control.classList.add('form-control-transition');
    });
}

/**
 * Initialize modal transitions
 */
function initModalTransitions() {
    // Add transition class to modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('modal-transition');
        
        // Add transition class to modal backdrop
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.classList.add('modal-backdrop-transition');
        }
    });
    
    // Add event listeners to modal triggers
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const modal = document.querySelector(targetId);
            if (modal && modal.classList.contains('modal-transition')) {
                modal.classList.add('show');
            }
        });
    });
}

/**
 * Initialize accordion transitions
 */
function initAccordionTransitions() {
    // Add transition class to accordion bodies
    const accordionBodies = document.querySelectorAll('.accordion-collapse');
    accordionBodies.forEach(body => {
        body.classList.add('accordion-transition');
    });
    
    // Add event listeners to accordion headers
    const accordionHeaders = document.querySelectorAll('.accordion-button');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const body = document.querySelector(targetId);
            if (body && body.classList.contains('accordion-transition')) {
                body.classList.toggle('show');
            }
        });
    });
}

/**
 * Initialize tab transitions
 */
function initTabTransitions() {
    // Add transition class to tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.add('tab-content-transition');
    });
    
    // Add event listeners to tab triggers
    const tabTriggers = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const pane = document.querySelector(targetId);
            if (pane && pane.classList.contains('tab-content-transition')) {
                // Hide all panes
                const allPanes = pane.parentElement.querySelectorAll('.tab-content-transition');
                allPanes.forEach(p => p.classList.remove('show'));
                
                // Show target pane
                pane.classList.add('show');
            }
        });
    });
}
