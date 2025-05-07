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
    }
};

// Default theme
let currentTheme = 'canvas-bloom';

// Function to apply theme
function applyTheme(themeName) {
    console.log('Applying theme:', themeName);

    if (!themes[themeName]) {
        console.error('Theme not found:', themeName);
        return;
    }

    const theme = themes[themeName];
    currentTheme = themeName;

    // Save theme preference to localStorage
    localStorage.setItem('varnikakart-theme', themeName);
    console.log('Theme saved to localStorage');

    // Apply CSS variables to root
    const root = document.documentElement;

    // Apply colors
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--background-color', theme.colors.background);
    root.style.setProperty('--text-color', theme.colors.text);
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

    // Apply category-specific CSS variable
    root.style.setProperty('--theme-category', theme.category || 'default');

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

    // Add theme-specific class to body
    document.body.className = '';
    document.body.classList.add(`theme-${themeName}`);
    console.log('Added theme class to body:', `theme-${themeName}`);

    // Apply theme-specific effects
    applyThemeEffects(themeName);
    console.log('Applied theme effects');

    // Trigger custom event for theme change
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
    console.log('Dispatched themeChanged event');
}

// Initialize theme switcher
function initThemeSwitcher() {
    console.log('Initializing theme switcher');

    // Add event listeners to desktop theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const themeName = option.dataset.theme;
            console.log('Desktop theme option clicked:', themeName);
            applyTheme(themeName);
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

    console.log('Theme switcher initialization complete');
}

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

    // Floating theme switcher removed as per user request
});
