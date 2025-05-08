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
            console.log('Dark mode enabled - all text should be white');
        } else {
            document.body.classList.remove(darkModeConfig.darkClass);
            console.log('Light mode enabled - all text should be black');
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

        // Force text color update by triggering a small reflow
        document.body.style.display = 'none';
        document.body.offsetHeight; // Force reflow
        document.body.style.display = '';

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

// Export functions for external use
window.darkMode = {
    toggle: toggleDarkMode,
    reset: resetToAutoMode
};
