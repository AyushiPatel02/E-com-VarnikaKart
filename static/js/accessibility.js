/**
 * Accessibility Improvements for VarnikaKart
 * Enhances website accessibility for all users
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accessibility features
    initAccessibility();
});

/**
 * Initialize all accessibility features
 */
function initAccessibility() {
    console.log('Initializing accessibility features');
    
    // Add skip to content link
    addSkipToContentLink();
    
    // Detect keyboard navigation
    detectKeyboardNavigation();
    
    // Add ARIA attributes
    addAriaAttributes();
    
    // Add font size controls
    addFontSizeControls();
    
    // Add high contrast mode toggle
    addHighContrastToggle();
    
    // Improve form accessibility
    improveFormAccessibility();
    
    // Add focus indicators
    addFocusIndicators();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
}

/**
 * Add skip to content link for keyboard users
 */
function addSkipToContentLink() {
    // Check if skip link already exists
    if (document.querySelector('.skip-to-content')) return;
    
    // Create skip link
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-to-content';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to content';
    
    // Add to beginning of body
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ID to main content if it doesn't exist
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    console.log('Added skip to content link');
}

/**
 * Detect keyboard navigation to show focus indicators
 */
function detectKeyboardNavigation() {
    // Add class to body when tab key is used
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove class when mouse is used
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    console.log('Keyboard navigation detection enabled');
}

/**
 * Add ARIA attributes to improve screen reader experience
 */
function addAriaAttributes() {
    // Add landmark roles
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
    }
    
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
    }
    
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
    }
    
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
    
    const search = document.querySelector('form[role="search"]');
    if (search && !search.getAttribute('role')) {
        search.setAttribute('role', 'search');
    }
    
    // Add aria-current to current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Add aria-expanded to dropdown toggles
    const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownToggles.forEach(toggle => {
        if (!toggle.hasAttribute('aria-expanded')) {
            toggle.setAttribute('aria-expanded', 'false');
        }
        
        // Add event listener to update aria-expanded
        toggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', (!expanded).toString());
        });
    });
    
    console.log('Added ARIA attributes to improve screen reader experience');
}

/**
 * Add font size controls to the page
 */
function addFontSizeControls() {
    // Check if controls already exist
    if (document.querySelector('.font-size-controls')) return;
    
    // Create controls container
    const controls = document.createElement('div');
    controls.className = 'font-size-controls';
    
    // Create decrease button
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'font-size-btn decrease-font';
    decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
    decreaseBtn.setAttribute('aria-label', 'Decrease font size');
    decreaseBtn.addEventListener('click', decreaseFontSize);
    
    // Create reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'font-size-btn reset-font';
    resetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    resetBtn.setAttribute('aria-label', 'Reset font size');
    resetBtn.addEventListener('click', resetFontSize);
    
    // Create increase button
    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'font-size-btn increase-font';
    increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
    increaseBtn.setAttribute('aria-label', 'Increase font size');
    increaseBtn.addEventListener('click', increaseFontSize);
    
    // Add buttons to container
    controls.appendChild(decreaseBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(increaseBtn);
    
    // Find a place to add the controls
    const navbar = document.querySelector('.navbar-nav');
    if (navbar) {
        navbar.appendChild(controls);
    }
    
    // Load saved font size preference
    const savedFontSize = localStorage.getItem('varnikakart-font-size');
    if (savedFontSize) {
        document.body.classList.add(savedFontSize);
    }
    
    console.log('Added font size controls');
}

/**
 * Decrease font size
 */
function decreaseFontSize() {
    if (document.body.classList.contains('font-size-largest')) {
        document.body.classList.remove('font-size-largest');
        document.body.classList.add('font-size-larger');
        localStorage.setItem('varnikakart-font-size', 'font-size-larger');
    } else if (document.body.classList.contains('font-size-larger')) {
        document.body.classList.remove('font-size-larger');
        localStorage.removeItem('varnikakart-font-size');
    }
}

/**
 * Reset font size
 */
function resetFontSize() {
    document.body.classList.remove('font-size-larger', 'font-size-largest');
    localStorage.removeItem('varnikakart-font-size');
}

/**
 * Increase font size
 */
function increaseFontSize() {
    if (document.body.classList.contains('font-size-larger')) {
        document.body.classList.remove('font-size-larger');
        document.body.classList.add('font-size-largest');
        localStorage.setItem('varnikakart-font-size', 'font-size-largest');
    } else if (!document.body.classList.contains('font-size-largest')) {
        document.body.classList.add('font-size-larger');
        localStorage.setItem('varnikakart-font-size', 'font-size-larger');
    }
}

/**
 * Add high contrast mode toggle
 */
function addHighContrastToggle() {
    // Check if toggle already exists
    if (document.getElementById('highContrastBtn')) return;
    
    // Create toggle button
    const highContrastBtn = document.createElement('button');
    highContrastBtn.id = 'highContrastBtn';
    highContrastBtn.className = 'btn btn-sm btn-outline-primary ms-2';
    highContrastBtn.innerHTML = '<i class="fas fa-adjust"></i> High Contrast';
    highContrastBtn.setAttribute('aria-pressed', 'false');
    
    // Add click event
    highContrastBtn.addEventListener('click', toggleHighContrast);
    
    // Find a place to add the button
    const modeButtons = document.querySelector('.mode-buttons');
    if (modeButtons) {
        modeButtons.appendChild(highContrastBtn);
    }
    
    // Load saved preference
    const highContrastEnabled = localStorage.getItem('varnikakart-high-contrast') === 'true';
    if (highContrastEnabled) {
        document.body.classList.add('high-contrast');
        highContrastBtn.setAttribute('aria-pressed', 'true');
        highContrastBtn.classList.remove('btn-outline-primary');
        highContrastBtn.classList.add('btn-primary');
    }
    
    console.log('Added high contrast mode toggle');
}

/**
 * Toggle high contrast mode
 */
function toggleHighContrast() {
    const highContrastBtn = document.getElementById('highContrastBtn');
    const isEnabled = document.body.classList.toggle('high-contrast');
    
    // Update button state
    highContrastBtn.setAttribute('aria-pressed', isEnabled.toString());
    
    if (isEnabled) {
        highContrastBtn.classList.remove('btn-outline-primary');
        highContrastBtn.classList.add('btn-primary');
    } else {
        highContrastBtn.classList.remove('btn-primary');
        highContrastBtn.classList.add('btn-outline-primary');
    }
    
    // Save preference
    localStorage.setItem('varnikakart-high-contrast', isEnabled.toString());
}

/**
 * Improve form accessibility
 */
function improveFormAccessibility() {
    // Add labels to form controls without labels
    const formControls = document.querySelectorAll('input, select, textarea');
    
    formControls.forEach(control => {
        // Skip if it already has a label or is a hidden input
        if (control.type === 'hidden' || control.hasAttribute('aria-label') || 
            document.querySelector(`label[for="${control.id}"]`)) {
            return;
        }
        
        // Add aria-label if placeholder exists
        if (control.placeholder) {
            control.setAttribute('aria-label', control.placeholder);
        }
        
        // Add required attribute announcement
        if (control.required && !control.hasAttribute('aria-required')) {
            control.setAttribute('aria-required', 'true');
        }
    });
    
    // Improve error messages
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const invalidControls = form.querySelectorAll(':invalid');
            
            invalidControls.forEach(control => {
                // Add aria-invalid attribute
                control.setAttribute('aria-invalid', 'true');
                
                // Find or create error message container
                let errorContainer = document.getElementById(`${control.id}-error`);
                
                if (!errorContainer) {
                    errorContainer = document.createElement('div');
                    errorContainer.id = `${control.id}-error`;
                    errorContainer.className = 'invalid-feedback';
                    errorContainer.setAttribute('aria-live', 'polite');
                    control.parentNode.appendChild(errorContainer);
                }
                
                // Set error message
                errorContainer.textContent = control.validationMessage;
                
                // Connect control to error message
                control.setAttribute('aria-describedby', errorContainer.id);
            });
        });
    });
    
    console.log('Improved form accessibility');
}

/**
 * Add focus indicators for better keyboard navigation
 */
function addFocusIndicators() {
    // Add tabindex to interactive elements that might not be focusable
    const interactiveElements = document.querySelectorAll('.card, .product-card');
    
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex') && !element.querySelector('a, button, input')) {
            element.setAttribute('tabindex', '0');
        }
    });
    
    console.log('Added focus indicators for better keyboard navigation');
}

/**
 * Add keyboard shortcuts for common actions
 */
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only apply shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Alt + 1: Go to home page
        if (e.altKey && e.key === '1') {
            window.location.href = '/';
        }
        
        // Alt + 2: Go to products page
        if (e.altKey && e.key === '2') {
            window.location.href = '/products/';
        }
        
        // Alt + 3: Go to cart
        if (e.altKey && e.key === '3') {
            window.location.href = '/cart/';
        }
        
        // Alt + 4: Go to account
        if (e.altKey && e.key === '4') {
            window.location.href = '/account/';
        }
        
        // Alt + s: Focus search
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Alt + c: Toggle high contrast
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            toggleHighContrast();
        }
    });
    
    // Add keyboard shortcut information
    const keyboardShortcutsInfo = document.createElement('div');
    keyboardShortcutsInfo.className = 'keyboard-shortcuts-info sr-only';
    keyboardShortcutsInfo.setAttribute('aria-live', 'polite');
    keyboardShortcutsInfo.textContent = 'Keyboard shortcuts available. Press Alt+H for help.';
    document.body.appendChild(keyboardShortcutsInfo);
    
    // Alt + H: Show keyboard shortcuts help
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            showKeyboardShortcutsHelp();
        }
    });
    
    console.log('Added keyboard shortcuts');
}

/**
 * Show keyboard shortcuts help
 */
function showKeyboardShortcutsHelp() {
    // Create modal if it doesn't exist
    let shortcutsModal = document.getElementById('keyboardShortcutsModal');
    
    if (!shortcutsModal) {
        shortcutsModal = document.createElement('div');
        shortcutsModal.id = 'keyboardShortcutsModal';
        shortcutsModal.className = 'modal fade';
        shortcutsModal.setAttribute('tabindex', '-1');
        shortcutsModal.setAttribute('aria-labelledby', 'keyboardShortcutsModalLabel');
        shortcutsModal.setAttribute('aria-hidden', 'true');
        
        shortcutsModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="keyboardShortcutsModalLabel">Keyboard Shortcuts</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Shortcut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><kbd>Alt</kbd> + <kbd>1</kbd></td>
                                    <td>Go to home page</td>
                                </tr>
                                <tr>
                                    <td><kbd>Alt</kbd> + <kbd>2</kbd></td>
                                    <td>Go to products page</td>
                                </tr>
                                <tr>
                                    <td><kbd>Alt</kbd> + <kbd>3</kbd></td>
                                    <td>Go to cart</td>
                                </tr>
                                <tr>
                                    <td><kbd>Alt</kbd> + <kbd>4</kbd></td>
                                    <td>Go to account</td>
                                </tr>
                                <tr>
                                    <td><kbd>Alt</kbd> + <kbd>S</kbd></td>
                                    <td>Focus search</td>
                                </tr>
                                <tr>
                                    <td><kbd>Alt</kbd> + <kbd>C</kbd></td>
                                    <td>Toggle high contrast</td>
                                </tr>
                                <tr>
                                    <td><kbd>Alt</kbd> + <kbd>H</kbd></td>
                                    <td>Show this help</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(shortcutsModal);
    }
    
    // Show modal
    const modal = new bootstrap.Modal(shortcutsModal);
    modal.show();
}
