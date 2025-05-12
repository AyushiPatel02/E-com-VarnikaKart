/**
 * VarnikaKart Dark Mode System
 * Automatically switches between light and dark mode based on time of day
 * Allows manual override with user preference saved in localStorage
 */

// Dark mode configuration
const darkModeConfig = {
    // Time ranges for automatic switching (24-hour format)
    autoSwitchTimes: {
        lightStart: 6, // 6:00 AM
        darkStart: 18  // 6:00 PM
    },
    // localStorage keys
    storage: {
        mode: 'varnikakart-dark-mode',      // 'auto', 'light', 'dark'
        lastTheme: 'varnikakart-last-theme' // Last active theme before dark mode toggle
    },
    // CSS class added to body when dark mode is active
    darkClass: 'dark-mode',
    // Transition duration in milliseconds
    transitionDuration: 300
};

// Dark mode variants for each theme
const darkModeVariants = {
    'canvas-bloom': {
        darkVariant: 'canvas-bloom-dark',
        icon: 'palette'
    },
    'midnight-royal': {
        darkVariant: 'midnight-royal-dark',
        icon: 'gem'
    },
    'pastel-pop': {
        darkVariant: 'pastel-pop-dark',
        icon: 'gift'
    },
    'boho-vibe': {
        darkVariant: 'boho-vibe-dark',
        icon: 'home'
    },
    'monochrome-chic': {
        darkVariant: 'monochrome-chic-dark',
        icon: 'tachometer-alt'
    }
};

// Current state
let darkModeState = {
    mode: 'auto',           // 'auto', 'light', 'dark'
    isDarkMode: false,      // Current dark mode state
    currentTheme: null,     // Current theme name
    originalTheme: null     // Original theme before dark mode was applied
};

/**
 * Initialize dark mode system
 */
function initDarkMode() {
    console.log('Initializing dark mode system');

    // Load user preferences from localStorage
    loadDarkModePreferences();

    // Create toggle button
    createDarkModeToggle();

    // Apply initial state
    applyDarkMode();

    // Set up automatic switching if in auto mode
    if (darkModeState.mode === 'auto') {
        // Check time immediately
        checkTimeAndApplyTheme();

        // Set up interval to check time every minute
        setInterval(checkTimeAndApplyTheme, 60000);
    }
}

/**
 * Load dark mode preferences from localStorage
 */
function loadDarkModePreferences() {
    // Get mode preference
    const savedMode = localStorage.getItem(darkModeConfig.storage.mode);
    if (savedMode) {
        darkModeState.mode = savedMode;
        console.log('Loaded dark mode preference:', darkModeState.mode);
    }

    // Get last active theme
    const lastTheme = localStorage.getItem(darkModeConfig.storage.lastTheme);
    if (lastTheme) {
        darkModeState.originalTheme = lastTheme;
        console.log('Loaded last theme:', darkModeState.originalTheme);
    }
}

/**
 * Create dark mode toggle button
 */
function createDarkModeToggle() {
    // Create floating toggle button for mobile
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'dark-mode-toggle';

    const toggleButton = document.createElement('button');
    toggleButton.className = 'dark-mode-btn';
    toggleButton.setAttribute('title', 'Toggle Dark Mode');
    toggleButton.innerHTML = '<i class="fas fa-moon"></i>';

    // Add click event
    toggleButton.addEventListener('click', toggleDarkMode);

    // Add to container
    toggleContainer.appendChild(toggleButton);

    // Add to body
    document.body.appendChild(toggleContainer);

    // Set up navbar mode buttons
    setupNavbarModeButtons();

    // Update button icon based on current state
    updateToggleIcon();
}

/**
 * Set up navbar mode buttons
 */
function setupNavbarModeButtons() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupNavbarModeButtons);
        return;
    }

    // Find mode buttons in navbar
    const lightModeBtn = document.getElementById('lightModeBtn');
    const darkModeBtn = document.getElementById('darkModeBtn');
    const autoModeBtn = document.getElementById('autoModeBtn');

    if (!lightModeBtn || !darkModeBtn || !autoModeBtn) {
        console.warn('Mode buttons not found in navbar');
        return;
    }

    // Add click events
    lightModeBtn.addEventListener('click', () => setMode('light'));
    darkModeBtn.addEventListener('click', () => setMode('dark'));
    autoModeBtn.addEventListener('click', () => setMode('auto'));

    // Update active button based on current mode
    updateModeButtons();
}

/**
 * Set mode (light, dark, or auto)
 */
function setMode(mode) {
    darkModeState.mode = mode;
    localStorage.setItem(darkModeConfig.storage.mode, mode);
    console.log('Set mode to:', mode);

    // Apply the change
    applyDarkMode();

    // Update buttons
    updateModeButtons();
    updateToggleIcon();
}

/**
 * Update mode buttons to show active state
 */
function updateModeButtons() {
    const lightModeBtn = document.getElementById('lightModeBtn');
    const darkModeBtn = document.getElementById('darkModeBtn');
    const autoModeBtn = document.getElementById('autoModeBtn');

    if (!lightModeBtn || !darkModeBtn || !autoModeBtn) {
        return;
    }

    // Remove active class from all buttons
    lightModeBtn.classList.remove('active', 'btn-primary');
    lightModeBtn.classList.add('btn-outline-primary');

    darkModeBtn.classList.remove('active', 'btn-primary');
    darkModeBtn.classList.add('btn-outline-primary');

    autoModeBtn.classList.remove('active', 'btn-primary');
    autoModeBtn.classList.add('btn-outline-primary');

    // Add active class to current mode button
    if (darkModeState.mode === 'light') {
        lightModeBtn.classList.add('active', 'btn-primary');
        lightModeBtn.classList.remove('btn-outline-primary');
    } else if (darkModeState.mode === 'dark') {
        darkModeBtn.classList.add('active', 'btn-primary');
        darkModeBtn.classList.remove('btn-outline-primary');
    } else {
        autoModeBtn.classList.add('active', 'btn-primary');
        autoModeBtn.classList.remove('btn-outline-primary');
    }
}

/**
 * Update toggle button icon based on current state
 */
function updateToggleIcon() {
    const isDark = darkModeState.isDarkMode;
    const isAuto = darkModeState.mode === 'auto';

    // Update floating button (mobile only)
    const floatingBtn = document.querySelector('.dark-mode-btn i');
    if (floatingBtn) {
        floatingBtn.className = isDark ? 'fas fa-sun' : 'fas fa-moon';

        // Add auto indicator if in auto mode
        const autoIndicator = document.querySelector('.dark-mode-btn .auto-indicator');
        if (isAuto && !autoIndicator) {
            const indicator = document.createElement('span');
            indicator.className = 'auto-indicator';
            indicator.textContent = 'A';
            floatingBtn.parentNode.appendChild(indicator);
        } else if (!isAuto && autoIndicator) {
            autoIndicator.remove();
        }
    }

    // Update theme switcher icon in navbar
    const themeIcon = document.querySelector('#themeSwitcherBtn i');
    if (themeIcon) {
        // Keep the palette icon, but add a small indicator
        const modeIndicator = document.querySelector('#themeSwitcherBtn .mode-indicator');

        if (!modeIndicator) {
            const indicator = document.createElement('span');
            indicator.className = 'mode-indicator';
            indicator.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            themeIcon.parentNode.appendChild(indicator);
        } else {
            modeIndicator.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    }

    // Update mode buttons in dropdown
    updateModeButtons();
}

/**
 * Toggle dark mode manually (used by floating button)
 */
function toggleDarkMode() {
    // If in auto mode, switch to manual and set to opposite of current
    if (darkModeState.mode === 'auto') {
        darkModeState.mode = darkModeState.isDarkMode ? 'light' : 'dark';
    }
    // If in manual mode, toggle between light and dark
    else {
        darkModeState.mode = darkModeState.mode === 'dark' ? 'light' : 'dark';
    }

    // Save preference
    localStorage.setItem(darkModeConfig.storage.mode, darkModeState.mode);
    console.log('Saved dark mode preference:', darkModeState.mode);

    // Apply the change
    applyDarkMode();

    // Update UI
    updateToggleIcon();
    updateModeButtons();
}

/**
 * Reset to automatic mode
 */
function resetToAutoMode() {
    darkModeState.mode = 'auto';
    localStorage.setItem(darkModeConfig.storage.mode, 'auto');

    // Check time and apply appropriate theme
    checkTimeAndApplyTheme();

    // Update button icon
    updateToggleIcon();
}

/**
 * Check current time and apply appropriate theme
 */
function checkTimeAndApplyTheme() {
    // Only proceed if in auto mode
    if (darkModeState.mode !== 'auto') return;

    const currentHour = new Date().getHours();
    const shouldBeDark = currentHour < darkModeConfig.autoSwitchTimes.lightStart ||
                         currentHour >= darkModeConfig.autoSwitchTimes.darkStart;

    // Only update if the dark mode state has changed
    if (shouldBeDark !== darkModeState.isDarkMode) {
        darkModeState.isDarkMode = shouldBeDark;
        applyDarkMode();
        updateToggleIcon();
    }
}

/**
 * Apply dark mode based on current state with smooth transition
 */
function applyDarkMode() {
    // Determine if dark mode should be active
    let shouldBeDark = false;

    if (darkModeState.mode === 'auto') {
        const currentHour = new Date().getHours();
        shouldBeDark = currentHour < darkModeConfig.autoSwitchTimes.lightStart ||
                       currentHour >= darkModeConfig.autoSwitchTimes.darkStart;
    } else {
        shouldBeDark = darkModeState.mode === 'dark';
    }

    // If dark mode state hasn't changed, don't do anything
    if (shouldBeDark === darkModeState.isDarkMode) {
        return;
    }

    // Create transition overlay for smooth mode change
    const overlay = createDarkModeTransition(shouldBeDark);

    // Update state
    darkModeState.isDarkMode = shouldBeDark;

    // Get current theme
    const currentTheme = getCurrentTheme();
    darkModeState.currentTheme = currentTheme;

    // Store original theme if not already set
    if (!darkModeState.originalTheme) {
        darkModeState.originalTheme = currentTheme;
        localStorage.setItem(darkModeConfig.storage.lastTheme, currentTheme);
    }

    // After a short delay to allow the overlay to appear
    setTimeout(() => {
        // Apply dark mode class to body
        if (shouldBeDark) {
            document.body.classList.add(darkModeConfig.darkClass);
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--icon-color', '#ffffff');
            console.log('Dark mode enabled - all text and icons should be white');
        } else {
            document.body.classList.remove(darkModeConfig.darkClass);
            document.documentElement.style.setProperty('--text-color', '#000000');
            document.documentElement.style.setProperty('--icon-color', '#000000');
            console.log('Light mode enabled - all text and icons should be black');
        }

        // Switch to dark variant of theme if needed
        if (shouldBeDark && darkModeVariants[currentTheme]) {
            // Only switch if not already using dark variant
            if (!currentTheme.endsWith('-dark')) {
                // Store original theme
                darkModeState.originalTheme = currentTheme;
                localStorage.setItem(darkModeConfig.storage.lastTheme, currentTheme);

                // Switch to dark variant
                window.themeManager.applyTheme(darkModeVariants[currentTheme].darkVariant);
            }
        }
        // Switch back to original theme if needed
        else if (!shouldBeDark && darkModeState.originalTheme) {
            // Only switch if currently using dark variant
            if (currentTheme.endsWith('-dark')) {
                window.themeManager.applyTheme(darkModeState.originalTheme);
            }
        }

        // Apply specific fixes for dark mode
        applyDarkModeSpecificFixes(shouldBeDark);

        // Dispatch a custom event for other scripts to react to mode change
        document.dispatchEvent(new CustomEvent('darkModeChanged', {
            detail: {
                isDarkMode: shouldBeDark
            }
        }));

        // Remove the transition overlay after mode is applied
        setTimeout(() => {
            removeDarkModeTransition(overlay);
        }, 300);
    }, 100);
}

/**
 * Apply specific fixes for dark mode
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function applyDarkModeSpecificFixes(isDarkMode) {
    console.log('Applying specific fixes for ' + (isDarkMode ? 'dark' : 'light') + ' mode');

    // Force text color update by triggering a small reflow
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    document.body.style.display = '';

    // Fix feature cards
    fixFeatureCards(isDarkMode);

    // Fix product cards
    fixProductCards(isDarkMode);

    // Fix navbar
    fixNavbar(isDarkMode);

    // Fix footer
    fixFooter(isDarkMode);

    // Fix newsletter section
    fixNewsletterSection(isDarkMode);

    // Fix buttons
    fixButtons(isDarkMode);

    // Force browser to repaint by adding and removing a class
    document.body.classList.add('dark-mode-refreshing');
    setTimeout(() => {
        document.body.classList.remove('dark-mode-refreshing');
    }, 50);
}

/**
 * Fix feature cards for dark/light mode
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function fixFeatureCards(isDarkMode) {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        // Force card to repaint
        card.style.display = 'none';
        card.offsetHeight;
        card.style.display = '';

        // Always ensure feature cards have white background and black text
        card.style.backgroundColor = '#ffffff';

        // Fix text colors
        const cardTexts = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a:not(.btn)');
        cardTexts.forEach(text => {
            if (!text.closest('.feature-icon')) {
                text.style.color = '#000000';
            }
        });

        // Fix feature icon
        const featureIcon = card.querySelector('.feature-icon');
        if (featureIcon) {
            // Get primary color from CSS variables
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            featureIcon.style.backgroundColor = primaryColor;

            // Fix icon color
            const iconElements = featureIcon.querySelectorAll('i, .fa, .fas, .far, .fab');
            iconElements.forEach(icon => {
                icon.style.color = '#ffffff';
            });
        }
    });
}

/**
 * Fix product cards for dark/light mode
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function fixProductCards(isDarkMode) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Force card to repaint
        card.style.display = 'none';
        card.offsetHeight;
        card.style.display = '';

        // Set background color based on mode
        if (isDarkMode) {
            card.style.backgroundColor = '#1e1e1e';

            // Fix card body and footer
            const cardBody = card.querySelector('.card-body');
            const cardFooter = card.querySelector('.card-footer');

            if (cardBody) cardBody.style.backgroundColor = '#1e1e1e';
            if (cardFooter) cardFooter.style.backgroundColor = '#1e1e1e';

            // Fix text colors
            const cardTexts = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a:not(.btn)');
            cardTexts.forEach(text => {
                text.style.color = '#ffffff';
            });
        } else {
            card.style.backgroundColor = '#ffffff';

            // Fix card body and footer
            const cardBody = card.querySelector('.card-body');
            const cardFooter = card.querySelector('.card-footer');

            if (cardBody) cardBody.style.backgroundColor = '#ffffff';
            if (cardFooter) cardFooter.style.backgroundColor = '#ffffff';

            // Fix text colors
            const cardTexts = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a:not(.btn)');
            cardTexts.forEach(text => {
                text.style.color = '#000000';
            });
        }
    });
}

/**
 * Fix navbar for dark/light mode
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function fixNavbar(isDarkMode) {
    const navbar = document.querySelector('.pro-navbar');
    if (navbar) {
        // Force navbar to repaint
        navbar.style.display = 'none';
        navbar.offsetHeight;
        navbar.style.display = '';

        // Set background color based on mode
        if (isDarkMode) {
            navbar.style.backgroundColor = '#121212';

            // Fix text colors
            const navLinks = navbar.querySelectorAll('.nav-link, .navbar-brand, .dropdown-toggle');
            navLinks.forEach(link => {
                link.style.color = '#ffffff';
            });
        } else {
            // Get nav background color from CSS variables
            const navBgColor = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg-color').trim();
            if (navBgColor) {
                navbar.style.backgroundColor = navBgColor;
            }

            // Fix text colors
            const navLinks = navbar.querySelectorAll('.nav-link, .navbar-brand, .dropdown-toggle');
            navLinks.forEach(link => {
                link.style.color = '#000000';
            });
        }
    }
}

/**
 * Fix footer for dark/light mode
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function fixFooter(isDarkMode) {
    const footer = document.querySelector('.footer');
    if (footer) {
        // Force footer to repaint
        footer.style.display = 'none';
        footer.offsetHeight;
        footer.style.display = '';

        // Fix text colors
        const footerTexts = footer.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a:not(.btn)');
        footerTexts.forEach(text => {
            text.style.color = isDarkMode ? '#ffffff' : '#000000';
        });
    }
}

/**
 * Fix newsletter section for dark/light mode
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function fixNewsletterSection(isDarkMode) {
    const newsletterSection = document.querySelector('.newsletter-section');
    if (newsletterSection) {
        // Force section to repaint
        newsletterSection.style.display = 'none';
        newsletterSection.offsetHeight;
        newsletterSection.style.display = '';

        // Fix text colors
        const sectionTexts = newsletterSection.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, label');
        sectionTexts.forEach(text => {
            text.style.color = isDarkMode ? '#ffffff' : '#000000';
        });
    }
}

/**
 * Fix buttons for dark/light mode
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function fixButtons(isDarkMode) {
    // Get primary color from CSS variables
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const buttonTextColor = getComputedStyle(document.documentElement).getPropertyValue('--button-text-color').trim();

    // Fix primary buttons
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(button => {
        button.style.backgroundColor = primaryColor;
        button.style.borderColor = primaryColor;
        button.style.color = buttonTextColor;
    });

    // Fix outline buttons
    const outlineButtons = document.querySelectorAll('.btn-outline-primary');
    outlineButtons.forEach(button => {
        button.style.borderColor = primaryColor;
        button.style.color = primaryColor;

        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = primaryColor;
            this.style.color = buttonTextColor;
        });

        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = primaryColor;
        });
    });
}

/**
 * Create a transition effect for dark mode toggle
 */
function createDarkModeTransition(toDark) {
    const overlay = document.createElement('div');
    overlay.className = 'dark-mode-transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = toDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.pointerEvents = 'none';

    // Add an icon to indicate mode change
    const icon = document.createElement('div');
    icon.style.position = 'absolute';
    icon.style.top = '50%';
    icon.style.left = '50%';
    icon.style.transform = 'translate(-50%, -50%)';
    icon.style.fontSize = '3rem';
    icon.style.color = toDark ? '#ffffff' : '#000000';
    icon.style.opacity = '0';
    icon.style.transition = 'opacity 0.3s ease';
    icon.innerHTML = toDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

    overlay.appendChild(icon);
    document.body.appendChild(overlay);

    // Force reflow to ensure transition works
    overlay.offsetHeight;

    // Fade in
    overlay.style.opacity = '1';
    icon.style.opacity = '0.7';

    return overlay;
}

/**
 * Remove the dark mode transition overlay
 */
function removeDarkModeTransition(overlay) {
    if (!overlay) return;

    // Fade out
    overlay.style.opacity = '0';

    // Remove from DOM after transition
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 300);
}

/**
 * Get current active theme
 */
function getCurrentTheme() {
    // Try to get from localStorage first
    const savedTheme = localStorage.getItem('varnikakart-theme');
    if (savedTheme) return savedTheme;

    // Default to first theme
    return Object.keys(darkModeVariants)[0];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDarkMode);

/**
 * Initialize dark mode advanced features
 */
function initDarkModeAdvancedFeatures() {
    // Only initialize if dark mode is active
    if (!darkModeState.isDarkMode) return;

    console.log('Initializing dark mode advanced features');

    // Initialize particle effect if particles.js is available
    initParticleEffect();

    // Initialize custom cursor effect
    initCustomCursor();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize 3D card effects
    init3DCardEffects();

    // Initialize glass morphism effects
    initGlassMorphism();

    // Initialize advanced text color handling
    initAdvancedTextColorHandling();
}

/**
 * Initialize particle effect for dark mode
 */
function initParticleEffect() {
    // Check if particles.js is available
    if (typeof particlesJS === 'undefined') {
        console.log('particles.js not available, skipping particle effect');
        return;
    }

    // Create container for particles
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-js';
    particlesContainer.className = 'particles-js';
    document.body.appendChild(particlesContainer);

    // Configure particles
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.2,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.3,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.3
                    }
                },
                push: {
                    particles_nb: 3
                }
            }
        },
        retina_detect: true
    });
}

/**
 * Initialize custom cursor effect for dark mode
 */
function initCustomCursor() {
    // Only apply to desktop
    if (window.innerWidth < 992) return;

    // Create cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorOutline);

    // Add custom-cursor class to body
    document.body.classList.add('custom-cursor');

    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        // Only update if dark mode is active
        if (!darkModeState.isDarkMode) return;

        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;

        // Add slight delay to outline for smooth effect
        setTimeout(() => {
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        }, 50);
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .card, .product-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.width = '15px';
            cursorDot.style.height = '15px';
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'var(--primary-color)';
        });

        el.addEventListener('mouseleave', () => {
            cursorDot.style.width = '10px';
            cursorDot.style.height = '10px';
            cursorOutline.style.width = '30px';
            cursorOutline.style.height = '30px';
            cursorOutline.style.borderColor = 'rgba(var(--primary-color-rgb), 0.5)';
        });
    });
}

/**
 * Initialize scroll animations for dark mode
 */
function initScrollAnimations() {
    // Add fade-in-up class to elements that should animate on scroll
    const animateElements = document.querySelectorAll('.card, .product-card, .section-title, .hero-content, .feature-card');
    animateElements.forEach(el => {
        el.classList.add('fade-in-up');
    });

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe elements
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize 3D card effects for dark mode
 */
function init3DCardEffects() {
    // Add 3D effect to cards
    const cards = document.querySelectorAll('.card, .product-card');
    cards.forEach(card => {
        // Add 3D classes
        card.classList.add('card-3d');

        // Create inner wrapper if not exists
        let inner = card.querySelector('.card-3d-inner');
        if (!inner) {
            inner = document.createElement('div');
            inner.className = 'card-3d-inner';

            // Move all children to inner wrapper
            while (card.firstChild) {
                inner.appendChild(card.firstChild);
            }

            card.appendChild(inner);
        }

        // Add 3D effect on mouse move
        card.addEventListener('mousemove', (e) => {
            // Only apply if dark mode is active
            if (!darkModeState.isDarkMode) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'rotateX(0) rotateY(0)';
        });
    });
}

/**
 * Initialize glass morphism effects for dark mode
 */
function initGlassMorphism() {
    // Add glass effect to elements
    const glassElements = document.querySelectorAll('.navbar, .dropdown-menu, .modal-content, .offcanvas');
    glassElements.forEach(el => {
        el.classList.add('glass-effect');
    });
}

/**
 * Handle dark mode change event
 */
function handleDarkModeChange(event) {
    const isDarkMode = event.detail.isDarkMode;

    // Initialize or remove advanced features based on dark mode state
    if (isDarkMode) {
        initDarkModeAdvancedFeatures();
    } else {
        // Remove advanced features
        removeDarkModeAdvancedFeatures();
    }
}

/**
 * Remove dark mode advanced features
 */
function removeDarkModeAdvancedFeatures() {
    // Remove particle effect
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesContainer.remove();
    }

    // Remove custom cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot) cursorDot.remove();
    if (cursorOutline) cursorOutline.remove();
    document.body.classList.remove('custom-cursor');

    // Remove glass effect
    const glassElements = document.querySelectorAll('.glass-effect');
    glassElements.forEach(el => {
        el.classList.remove('glass-effect');
    });

    // Reset 3D card effects
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
        const inner = card.querySelector('.card-3d-inner');
        if (inner) {
            inner.style.transform = 'none';
        }
    });
}

// Listen for dark mode change events
document.addEventListener('darkModeChanged', handleDarkModeChange);

// Initialize advanced features if dark mode is active on load
document.addEventListener('DOMContentLoaded', () => {
    if (darkModeState.isDarkMode) {
        initDarkModeAdvancedFeatures();
    }
});

/**
 * Initialize advanced text color handling for dark mode
 * This function ensures proper text color contrast on all elements
 */
function initAdvancedTextColorHandling() {
    console.log('Initializing advanced text color handling for dark mode');

    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Process added nodes
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        processElementForDarkMode(node);
                    }
                });
            }

            // Process attribute changes
            if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'style' ||
                    mutation.attributeName === 'class') {
                    processElementForDarkMode(mutation.target);
                }
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Process all existing elements
    processElementForDarkMode(document.body);

    // Add event listener for dynamically loaded content
    document.addEventListener('DOMContentLoaded', () => {
        processElementForDarkMode(document.body);
    });

    // Add event listener for AJAX loaded content
    window.addEventListener('load', () => {
        processElementForDarkMode(document.body);
    });
}

/**
 * Process an element for dark mode text color handling
 * @param {Element} element - The element to process
 */
function processElementForDarkMode(element) {
    // Skip if dark mode is not active
    if (!darkModeState.isDarkMode) return;

    // Skip if element is not valid
    if (!element || !element.nodeType || element.nodeType !== 1) return;

    // Process the element
    applyDarkModeTextColor(element);

    // Process all child elements
    const children = element.querySelectorAll('*');
    children.forEach(child => {
        applyDarkModeTextColor(child);
    });
}

/**
 * Apply dark mode text color to an element based on its background
 * @param {Element} element - The element to process
 */
function applyDarkModeTextColor(element) {
    // Skip if element is not valid
    if (!element || !element.nodeType || element.nodeType !== 1) return;

    // Get computed style
    const style = window.getComputedStyle(element);
    const backgroundColor = style.backgroundColor;

    // Skip if background is transparent
    if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') return;

    // Parse background color
    const rgb = parseRGB(backgroundColor);
    if (!rgb) return;

    // Calculate luminance (perceived brightness)
    // Using the formula: 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    // Set data attribute for debugging
    element.setAttribute('data-luminance', luminance.toFixed(2));

    // Apply text color based on luminance
    // Threshold of 0.5 is a good starting point (0 = black, 1 = white)
    if (luminance > 0.5) {
        // Light background, use dark text
        element.style.setProperty('color', 'var(--text-on-light)', 'important');

        // Add data attribute for styling hooks
        element.setAttribute('data-dark-mode-bg', 'light');
    } else {
        // Dark background, use light text
        element.style.setProperty('color', 'var(--text-on-dark)', 'important');

        // Add data attribute for styling hooks
        element.setAttribute('data-dark-mode-bg', 'dark');
    }
}

/**
 * Parse RGB color string into components
 * @param {string} color - CSS color string (rgb, rgba, hex)
 * @returns {Object|null} - Object with r, g, b properties or null if parsing failed
 */
function parseRGB(color) {
    // Handle rgb/rgba format
    let match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (match) {
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10)
        };
    }

    // Handle hex format
    match = color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (match) {
        return {
            r: parseInt(match[1], 16),
            g: parseInt(match[2], 16),
            b: parseInt(match[3], 16)
        };
    }

    // Handle shorthand hex format
    match = color.match(/#([0-9a-f])([0-9a-f])([0-9a-f])/i);
    if (match) {
        return {
            r: parseInt(match[1] + match[1], 16),
            g: parseInt(match[2] + match[2], 16),
            b: parseInt(match[3] + match[3], 16)
        };
    }

    // Handle named colors (simplified, add more as needed)
    const namedColors = {
        'white': { r: 255, g: 255, b: 255 },
        'black': { r: 0, g: 0, b: 0 },
        'red': { r: 255, g: 0, b: 0 },
        'green': { r: 0, g: 128, b: 0 },
        'blue': { r: 0, g: 0, b: 255 },
        'yellow': { r: 255, g: 255, b: 0 },
        'gray': { r: 128, g: 128, b: 128 },
        'grey': { r: 128, g: 128, b: 128 }
    };

    if (namedColors[color.toLowerCase()]) {
        return namedColors[color.toLowerCase()];
    }

    return null;
}

// Export functions for external use
window.darkMode = {
    toggle: toggleDarkMode,
    reset: resetToAutoMode,
    initAdvancedFeatures: initDarkModeAdvancedFeatures,
    removeAdvancedFeatures: removeDarkModeAdvancedFeatures,
    initAdvancedTextColorHandling: initAdvancedTextColorHandling
};
