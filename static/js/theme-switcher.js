/**
 * VarnikaKart Theme Switcher
 * Allows users to switch between different visual themes
 */

// Theme definitions
const themes = {
    'canvas-bloom': {
        name: 'Canvas Bloom',
        description: 'Light artistic theme for paintings',
        category: 'paintings',
        colors: {
            primary: '#7e9a9a',
            secondary: '#a4c3b2',
            accent: '#efd9ce',
            background: '#f6f6f6',
            text: '#2c3e50',
            cardBg: '#ffffff',
            navBg: '#e8f0f0',
            footerBg: '#dce8e8',
            buttonText: '#ffffff',
            linkColor: '#5a7a7a',
            borderColor: '#d0e0e0'
        },
        styles: {
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
            fontFamily: "'Playfair Display', serif",
            headerStyle: 'elegant',
            buttonStyle: 'soft',
            cardStyle: 'framed'
        },
        effects: {
            brushStroke: true,
            paintSplatter: true
        }
    },
    'canvas-bloom-dark': {
        name: 'Canvas Bloom Dark',
        description: 'Dark artistic theme for paintings',
        category: 'paintings',
        colors: {
            primary: '#5a7a7a',
            secondary: '#7a9a9a',
            accent: '#c9a99e',
            background: '#1a2a2a',
            text: '#e0e0e0',
            cardBg: '#2a3a3a',
            navBg: '#1a2a2a',
            footerBg: '#1a2a2a',
            buttonText: '#ffffff',
            linkColor: '#a4c3b2',
            borderColor: '#3a4a4a'
        },
        styles: {
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            fontFamily: "'Playfair Display', serif",
            headerStyle: 'elegant',
            buttonStyle: 'soft',
            cardStyle: 'framed'
        },
        effects: {
            brushStroke: true,
            paintSplatter: true
        }
    },
    'midnight-royal': {
        name: 'Midnight Royal',
        description: 'Dark luxury theme for jewelry',
        category: 'jewelry',
        colors: {
            primary: '#6c5ce7',
            secondary: '#2d3436',
            accent: '#ffeaa7',
            background: '#1e272e',
            text: '#dfe6e9',
            cardBg: '#2d3436',
            navBg: '#0f1416',
            footerBg: '#0a0c0e',
            buttonText: '#ffffff',
            linkColor: '#a29bfe',
            borderColor: '#4b4b4b'
        },
        styles: {
            borderRadius: '8px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
            fontFamily: "'Cinzel', serif",
            headerStyle: 'royal',
            buttonStyle: 'glossy',
            cardStyle: 'dark'
        },
        effects: {
            shimmer: true,
            glow: true
        }
    },
    'midnight-royal-dark': {
        name: 'Midnight Royal Dark',
        description: 'Darker luxury theme for jewelry',
        category: 'jewelry',
        colors: {
            primary: '#4834d4',
            secondary: '#1a1c1e',
            accent: '#d4c675',
            background: '#0a0c0e',
            text: '#b0b5b9',
            cardBg: '#1a1c1e',
            navBg: '#000000',
            footerBg: '#000000',
            buttonText: '#ffffff',
            linkColor: '#8a7aff',
            borderColor: '#2a2a2a'
        },
        styles: {
            borderRadius: '8px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
            fontFamily: "'Cinzel', serif",
            headerStyle: 'royal',
            buttonStyle: 'glossy',
            cardStyle: 'dark'
        },
        effects: {
            shimmer: true,
            glow: true
        }
    },
    'pastel-pop': {
        name: 'Pastel Pop',
        description: 'Colorful modern theme for vibrant gifts',
        category: 'gifts',
        colors: {
            primary: '#ff9ff3',
            secondary: '#48dbfb',
            accent: '#feca57',
            background: '#f1f2f6',
            text: '#2f3542',
            cardBg: '#ffffff',
            navBg: '#fdeff9',
            footerBg: '#e4f9ff',
            buttonText: '#ffffff',
            linkColor: '#fd79a8',
            borderColor: '#d6f5ff'
        },
        styles: {
            borderRadius: '20px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
            fontFamily: "'Poppins', sans-serif",
            headerStyle: 'playful',
            buttonStyle: 'rounded',
            cardStyle: 'bubble'
        },
        effects: {
            confetti: true,
            bounce: true
        }
    },
    'pastel-pop-dark': {
        name: 'Pastel Pop Dark',
        description: 'Dark colorful theme for vibrant gifts',
        category: 'gifts',
        colors: {
            primary: '#c56db3',
            secondary: '#2a95b3',
            accent: '#c9a33a',
            background: '#1a1a24',
            text: '#e0e0e0',
            cardBg: '#2a2a34',
            navBg: '#1a1a24',
            footerBg: '#1a1a24',
            buttonText: '#ffffff',
            linkColor: '#ff9ff3',
            borderColor: '#3a3a44'
        },
        styles: {
            borderRadius: '20px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
            fontFamily: "'Poppins', sans-serif",
            headerStyle: 'playful',
            buttonStyle: 'rounded',
            cardStyle: 'bubble'
        },
        effects: {
            confetti: true,
            bounce: true
        }
    },
    'boho-vibe': {
        name: 'Boho Vibe',
        description: 'Earthy, bohemian theme for handmade decor',
        category: 'decor',
        colors: {
            primary: '#b97a63',
            secondary: '#8d7b68',
            accent: '#e6c9a8',
            background: '#f5f0e1',
            text: '#5d534a',
            cardBg: '#faf6ed',
            navBg: '#ede3d0',
            footerBg: '#e5d9c3',
            buttonText: '#ffffff',
            linkColor: '#a56a58',
            borderColor: '#d9cbb8'
        },
        styles: {
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            fontFamily: "'Montserrat', sans-serif",
            headerStyle: 'natural',
            buttonStyle: 'textured',
            cardStyle: 'earthy'
        },
        effects: {
            textureOverlay: true,
            naturalPatterns: true
        }
    },
    'boho-vibe-dark': {
        name: 'Boho Vibe Dark',
        description: 'Dark earthy theme for handmade decor',
        category: 'decor',
        colors: {
            primary: '#8a5a43',
            secondary: '#5d4b38',
            accent: '#a69068',
            background: '#1a1410',
            text: '#d0c0b0',
            cardBg: '#2a2420',
            navBg: '#1a1410',
            footerBg: '#1a1410',
            buttonText: '#ffffff',
            linkColor: '#c9a99e',
            borderColor: '#3a3430'
        },
        styles: {
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontFamily: "'Montserrat', sans-serif",
            headerStyle: 'natural',
            buttonStyle: 'textured',
            cardStyle: 'earthy'
        },
        effects: {
            textureOverlay: true,
            naturalPatterns: true
        }
    },
    'monochrome-chic': {
        name: 'Monochrome Chic',
        description: 'Sleek black-white theme with accent color',
        category: 'modern',
        colors: {
            primary: '#000000',
            secondary: '#333333',
            accent: '#e74c3c',
            background: '#ffffff',
            text: '#222222',
            cardBg: '#f9f9f9',
            navBg: '#000000',
            footerBg: '#111111',
            buttonText: '#ffffff',
            linkColor: '#e74c3c',
            borderColor: '#dddddd'
        },
        styles: {
            borderRadius: '0px',
            boxShadow: '0 15px 25px rgba(0,0,0,0.05)',
            fontFamily: "'Roboto', sans-serif",
            headerStyle: 'minimal',
            buttonStyle: 'sharp',
            cardStyle: 'flat'
        },
        effects: {
            sharpEdges: true,
            minimalAnimation: true
        }
    },
    'monochrome-chic-dark': {
        name: 'Monochrome Chic Dark',
        description: 'Inverted black-white theme with accent color',
        category: 'modern',
        colors: {
            primary: '#ffffff',
            secondary: '#555555',
            accent: '#e74c3c',
            background: '#000000',
            text: '#cccccc',
            cardBg: '#1a1a1a',
            navBg: '#000000',
            footerBg: '#000000',
            buttonText: '#000000',
            linkColor: '#e74c3c',
            borderColor: '#333333'
        },
        styles: {
            borderRadius: '0px',
            boxShadow: '0 15px 25px rgba(0,0,0,0.2)',
            fontFamily: "'Roboto', sans-serif",
            headerStyle: 'minimal',
            buttonStyle: 'sharp',
            cardStyle: 'flat'
        },
        effects: {
            sharpEdges: true,
            minimalAnimation: true
        }
    }
};

// Default theme
let currentTheme = 'canvas-bloom';

// Function to apply theme with smooth transition
function applyTheme(themeName) {
    console.log('Applying theme:', themeName);

    if (!themes[themeName]) {
        console.error('Theme not found:', themeName);
        return;
    }

    const theme = themes[themeName];
    const previousTheme = currentTheme;
    currentTheme = themeName;

    // Save theme preference to localStorage
    localStorage.setItem('varnikakart-theme', themeName);
    console.log('Theme saved to localStorage');

    // Create transition overlay for smooth theme change
    const transitionOverlay = createTransitionOverlay();

    // After a short delay to allow the overlay to appear
    setTimeout(() => {
        // Apply CSS variables to root
        const root = document.documentElement;

        // Apply colors
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--secondary-color', theme.colors.secondary);
        root.style.setProperty('--accent-color', theme.colors.accent);
        root.style.setProperty('--background-color', theme.colors.background);

        // Check if dark mode is active
        const isDarkModeActive = document.body.classList.contains('dark-mode');

        // Set text color based on dark mode state, not theme
        if (isDarkModeActive) {
            // In dark mode, text should be white regardless of theme
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--icon-color', '#ffffff');
            console.log('Dark mode active: Setting text and icons to white');
        } else {
            // In light mode, text should be black regardless of theme
            root.style.setProperty('--text-color', '#000000');
            root.style.setProperty('--icon-color', '#000000');
            console.log('Light mode active: Setting text and icons to black');
        }

        // Apply text-related colors with better contrast
        const textColorRgb = isDarkModeActive ?
            { r: 255, g: 255, b: 255 } : // White for dark mode
            { r: 0, g: 0, b: 0 };        // Black for light mode

        // Calculate secondary text color (slightly lighter than main text)
        const secondaryTextColor = isDarkModeActive ?
            'rgba(255, 255, 255, 0.85)' :
            'rgba(0, 0, 0, 0.85)';

        // Calculate muted text color (even lighter)
        const mutedTextColor = isDarkModeActive ?
            'rgba(255, 255, 255, 0.7)' :
            'rgba(0, 0, 0, 0.7)';

        root.style.setProperty('--text-color-secondary', secondaryTextColor);
        root.style.setProperty('--text-color-muted', mutedTextColor);

        root.style.setProperty('--card-bg-color', theme.colors.cardBg);
        root.style.setProperty('--nav-bg-color', theme.colors.navBg);
        root.style.setProperty('--footer-bg-color', theme.colors.footerBg);
        root.style.setProperty('--button-text-color', theme.colors.buttonText);
        root.style.setProperty('--link-color', theme.colors.linkColor);
        root.style.setProperty('--border-color', theme.colors.borderColor);

        // Apply styles
        root.style.setProperty('--border-radius', theme.styles.borderRadius);
        root.style.setProperty('--box-shadow', theme.styles.boxShadow);
        root.style.setProperty('--font-family', theme.styles.fontFamily);
        root.style.setProperty('--header-style', theme.styles.headerStyle);
        root.style.setProperty('--button-style', theme.styles.buttonStyle);
        root.style.setProperty('--card-style', theme.styles.cardStyle);

        // Apply text visibility enhancements based on dark mode, not theme
        root.style.setProperty('--heading-font-weight', isDarkModeActive ? '600' : '600');
        root.style.setProperty('--body-font-weight', isDarkModeActive ? '400' : '400');
        root.style.setProperty('--text-shadow-light', isDarkModeActive ? '0 1px 2px rgba(0,0,0,0.2)' : 'none');
        root.style.setProperty('--text-contrast-ratio', isDarkModeActive ? '1.1' : '1');

        // Apply category-specific CSS variable
        root.style.setProperty('--theme-category', theme.category || 'default');

        // Extract RGB values from primary color for use in rgba()
        const primaryRgb = hexToRgb(theme.colors.primary);
        if (primaryRgb) {
            root.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        }

        console.log('Applied CSS variables to root');

        // Update theme name in the UI
        const themeNameElement = document.getElementById('current-theme-name');
        if (themeNameElement) {
            themeNameElement.textContent = theme.name;
            console.log('Updated theme name in UI to:', theme.name);
        } else {
            console.warn('Theme name element not found');
        }

        // Update active theme in the theme switcher
        const themeOptions = document.querySelectorAll('.theme-option');
        console.log('Updating active state for', themeOptions.length, 'theme options');

        themeOptions.forEach(option => {
            if (option.dataset.theme === themeName) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Remove all theme classes from body
        document.body.classList.forEach(className => {
            if (className.startsWith('theme-')) {
                document.body.classList.remove(className);
            }
        });

        // Add theme-specific class to body
        document.body.classList.add(`theme-${themeName}`);
        console.log('Added theme class to body:', `theme-${themeName}`);

        // Apply theme-specific effects
        applyThemeEffects(themeName);
        console.log('Applied theme effects');

        // Force text color update by triggering a small reflow
        document.body.style.display = 'none';
        document.body.offsetHeight; // Force reflow
        document.body.style.display = '';

        // Remove the transition overlay after theme is applied
        setTimeout(() => {
            removeTransitionOverlay(transitionOverlay);

            // Trigger custom event for theme change
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: {
                    theme: themeName,
                    previousTheme: previousTheme,
                    isDarkMode: isDarkModeActive
                }
            }));
            console.log('Dispatched themeChanged event');
        }, 300);
    }, 100);
}

// Create a transition overlay for smooth theme switching
function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.pointerEvents = 'none';

    document.body.appendChild(overlay);

    // Force reflow to ensure transition works
    overlay.offsetHeight;

    // Fade in
    overlay.style.opacity = '1';

    return overlay;
}

// Remove the transition overlay
function removeTransitionOverlay(overlay) {
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

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse hex values
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return { r, g, b };
}

// Helper function to determine if a color is dark
function isColorDark(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return false;

    // Calculate relative luminance using the formula from WCAG 2.0
    // https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
    const luminance =
        0.2126 * (rgb.r / 255) +
        0.7152 * (rgb.g / 255) +
        0.0722 * (rgb.b / 255);

    // Return true if the color is dark (luminance < 0.5)
    return luminance < 0.5;
}

// Initialize theme switcher
function initThemeSwitcher() {
    console.log('Initializing theme switcher');

    // Add event listeners to desktop theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        // Add click event for theme selection
        option.addEventListener('click', () => {
            const themeName = option.dataset.theme;
            console.log('Desktop theme option clicked:', themeName);
            applyTheme(themeName);
        });

        // Add hover effect for theme preview
        option.addEventListener('mouseenter', () => {
            const themeName = option.dataset.theme;
            previewTheme(themeName, option);
        });

        // Restore original theme on mouse leave
        option.addEventListener('mouseleave', () => {
            restoreThemePreview();
        });
    });

    // Add event listeners to mobile theme options
    const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
    mobileThemeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const themeName = option.dataset.theme;
            console.log('Mobile theme option clicked:', themeName);
            applyTheme(themeName);

            // Update active state for mobile buttons
            mobileThemeOptions.forEach(btn => {
                if (btn.dataset.theme === themeName) {
                    btn.classList.remove('btn-outline-primary');
                    btn.classList.add('btn-primary');
                } else {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-primary');
                }
            });
        });
    });

    // Store original theme variables for preview functionality
    storeOriginalThemeVariables();
}

// Store original theme variables for preview functionality
let originalThemeVariables = {};
function storeOriginalThemeVariables() {
    const root = document.documentElement;
    originalThemeVariables = {
        primaryColor: getComputedStyle(root).getPropertyValue('--primary-color'),
        secondaryColor: getComputedStyle(root).getPropertyValue('--secondary-color'),
        accentColor: getComputedStyle(root).getPropertyValue('--accent-color'),
        borderRadius: getComputedStyle(root).getPropertyValue('--border-radius')
    };
}

// Preview a theme on hover without fully applying it
function previewTheme(themeName, element) {
    if (!themes[themeName]) return;

    const theme = themes[themeName];
    const root = document.documentElement;

    // Store current theme if not already stored
    if (!originalThemeVariables.primaryColor) {
        storeOriginalThemeVariables();
    }

    // Apply subtle preview changes
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--border-radius', theme.styles.borderRadius);

    // Add preview indicator
    const previewIndicator = document.createElement('div');
    previewIndicator.className = 'theme-preview-indicator';
    previewIndicator.textContent = 'Preview';
    previewIndicator.style.position = 'absolute';
    previewIndicator.style.top = '5px';
    previewIndicator.style.right = '10px';
    previewIndicator.style.fontSize = '10px';
    previewIndicator.style.padding = '2px 6px';
    previewIndicator.style.borderRadius = '10px';
    previewIndicator.style.backgroundColor = theme.colors.primary;
    previewIndicator.style.color = theme.colors.buttonText;
    previewIndicator.style.opacity = '0';
    previewIndicator.style.transition = 'opacity 0.2s ease';

    // Remove any existing preview indicators
    const existingIndicator = document.querySelector('.theme-preview-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    element.appendChild(previewIndicator);

    // Force reflow
    previewIndicator.offsetHeight;

    // Show indicator
    previewIndicator.style.opacity = '1';
}

// Restore original theme after preview
function restoreThemePreview() {
    if (!originalThemeVariables.primaryColor) return;

    const root = document.documentElement;

    // Restore original values
    root.style.setProperty('--primary-color', originalThemeVariables.primaryColor);
    root.style.setProperty('--secondary-color', originalThemeVariables.secondaryColor);
    root.style.setProperty('--accent-color', originalThemeVariables.accentColor);
    root.style.setProperty('--border-radius', originalThemeVariables.borderRadius);

    // Remove preview indicator with fade out
    const indicator = document.querySelector('.theme-preview-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 200);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme switcher script loaded');

    // Check if theme options exist
    const themeOptions = document.querySelectorAll('.theme-option');
    console.log('Found theme options:', themeOptions.length);

    const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
    console.log('Found mobile theme options:', mobileThemeOptions.length);

    // Initialize theme switcher
    initThemeSwitcher();

    // Load saved theme or use default
    const savedTheme = localStorage.getItem('varnikakart-theme');
    console.log('Saved theme from localStorage:', savedTheme);

    if (savedTheme && themes[savedTheme]) {
        console.log('Applying saved theme:', savedTheme);
        applyTheme(savedTheme);

        // Update active state for mobile buttons
        if (mobileThemeOptions.length > 0) {
            mobileThemeOptions.forEach(btn => {
                if (btn.dataset.theme === savedTheme) {
                    btn.classList.remove('btn-outline-primary');
                    btn.classList.add('btn-primary');
                }
            });
        }
    } else {
        console.log('No saved theme found, applying default theme:', currentTheme);
        applyTheme(currentTheme);

        // Update active state for mobile buttons
        if (mobileThemeOptions.length > 0) {
            mobileThemeOptions.forEach(btn => {
                if (btn.dataset.theme === currentTheme) {
                    btn.classList.remove('btn-outline-primary');
                    btn.classList.add('btn-primary');
                }
            });
        }
    }

    // Listen for dark mode changes to ensure text colors are properly applied
    document.addEventListener('darkModeChanged', function(event) {
        console.log('Dark mode changed event received:', event.detail.isDarkMode);

        // Force a small reflow to ensure text colors are properly applied
        document.body.style.display = 'none';
        document.body.offsetHeight; // Force reflow
        document.body.style.display = '';

        // Re-apply the current theme to ensure colors are properly set
        applyTheme(getCurrentTheme());
    });

    console.log('Theme switcher initialization complete');
});

// Floating theme switcher function removed as per user request

// Apply theme-specific effects
function applyThemeEffects(themeName) {
    const theme = themes[themeName];
    if (!theme || !theme.effects) return;

    // Remove all previous effect classes
    document.body.classList.remove(
        'effect-brush-stroke',
        'effect-paint-splatter',
        'effect-shimmer',
        'effect-glow',
        'effect-confetti',
        'effect-bounce',
        'effect-texture-overlay',
        'effect-natural-patterns',
        'effect-sharp-edges',
        'effect-minimal-animation'
    );

    // Add new effect classes
    if (theme.effects.brushStroke) document.body.classList.add('effect-brush-stroke');
    if (theme.effects.paintSplatter) document.body.classList.add('effect-paint-splatter');
    if (theme.effects.shimmer) document.body.classList.add('effect-shimmer');
    if (theme.effects.glow) document.body.classList.add('effect-glow');
    if (theme.effects.confetti) document.body.classList.add('effect-confetti');
    if (theme.effects.bounce) document.body.classList.add('effect-bounce');
    if (theme.effects.textureOverlay) document.body.classList.add('effect-texture-overlay');
    if (theme.effects.naturalPatterns) document.body.classList.add('effect-natural-patterns');
    if (theme.effects.sharpEdges) document.body.classList.add('effect-sharp-edges');
    if (theme.effects.minimalAnimation) document.body.classList.add('effect-minimal-animation');
}

// Expose theme functions globally
window.themeManager = {
    applyTheme: applyTheme,
    getCurrentTheme: function() {
        return currentTheme;
    },
    getThemes: function() {
        return themes;
    },
    previewTheme: previewTheme,
    restoreThemePreview: restoreThemePreview
};
