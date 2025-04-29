/**
 * VarnikaKart Theme Switcher
 * Allows users to switch between different visual themes
 */

// Theme definitions
const themes = {
    'artisanal-elegance': {
        name: 'Artisanal Elegance',
        description: 'Soft, elegant, handcrafted feel with light neumorphism',
        colors: {
            primary: '#d4a5a5',
            secondary: '#a5a6d4',
            accent: '#d4c9a5',
            background: '#f8f5f2',
            text: '#3a3a3a',
            cardBg: '#ffffff'
        },
        styles: {
            borderRadius: '15px',
            boxShadow: '8px 8px 15px #e6e6e6, -8px -8px 15px #ffffff',
            fontFamily: "'Cormorant Garamond', serif"
        }
    },
    'boho-brush': {
        name: 'Boho & Brush',
        description: 'Bohemian with artistic brush strokes',
        colors: {
            primary: '#c77d5e',
            secondary: '#8ba888',
            accent: '#e6c9a8',
            background: '#f5f1e8',
            text: '#4a4a4a',
            cardBg: '#fdfbf7'
        },
        styles: {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            fontFamily: "'Montserrat', sans-serif"
        }
    },
    'modern-minimal': {
        name: 'Modern Minimal',
        description: 'Clean, professional, and futuristic design',
        colors: {
            primary: '#4361ee',
            secondary: '#3a0ca3',
            accent: '#f72585',
            background: '#ffffff',
            text: '#2b2d42',
            cardBg: '#ffffff'
        },
        styles: {
            borderRadius: '10px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            fontFamily: "'Poppins', sans-serif"
        }
    },
    'mystic-indian': {
        name: 'Mystic Indian Fusion',
        description: 'Traditional Indian meets modern design',
        colors: {
            primary: '#9c0e0e',
            secondary: '#2c3e50',
            accent: '#f1c40f',
            background: '#f9f5eb',
            text: '#333333',
            cardBg: '#ffffff'
        },
        styles: {
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            fontFamily: "'Amita', cursive"
        }
    },
    'pastel-dream': {
        name: 'Pastel Dream',
        description: 'Soft, feminine, creative aesthetic',
        colors: {
            primary: '#ffafcc',
            secondary: '#a2d2ff',
            accent: '#cdb4db',
            background: '#fef9ff',
            text: '#5a5a5a',
            cardBg: '#ffffff'
        },
        styles: {
            borderRadius: '20px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
            fontFamily: "'Quicksand', sans-serif"
        }
    }
};

// Default theme
let currentTheme = 'artisanal-elegance';

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

    // Apply styles
    root.style.setProperty('--border-radius', theme.styles.borderRadius);
    root.style.setProperty('--box-shadow', theme.styles.boxShadow);
    root.style.setProperty('--font-family', theme.styles.fontFamily);

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
});
