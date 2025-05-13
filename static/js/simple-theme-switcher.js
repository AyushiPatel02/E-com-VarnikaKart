/**
 * Simple Theme Switcher for Testing
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple theme switcher loaded');

    // Theme definitions
    const themes = {
        'artisanal-elegance': {
            name: 'Artisanal Elegance',
            description: 'Soft, elegant, handcrafted feel with light neumorphism',
            colors: {
                primary: '#d35f5f',
                secondary: '#6a9b96',
                accent: '#e6b33e',
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

    // Add event listeners to desktop theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const themeName = this.dataset.theme;
            console.log('Desktop theme option clicked:', themeName);

            // Apply theme
            applyTheme(themeName);

            // Update active state
            themeOptions.forEach(opt => {
                if (opt.dataset.theme === themeName) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
        });
    });

    // Add event listeners to mobile theme options
    const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
    mobileThemeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const themeName = this.dataset.theme;
            console.log('Mobile theme option clicked:', themeName);

            // Apply theme
            applyTheme(themeName);

            // Update active state
            mobileThemeOptions.forEach(opt => {
                if (opt.dataset.theme === themeName) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
        });
    });

    // Function to apply theme
    function applyTheme(themeName) {
        if (!themes[themeName]) {
            console.error('Theme not found:', themeName);
            return;
        }

        const theme = themes[themeName];
        console.log('Applying theme:', theme.name);

        // Save to localStorage
        localStorage.setItem('varnikakart-theme', themeName);

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

        // Apply direct styles to body
        document.body.style.backgroundColor = theme.colors.background;
        document.body.style.color = theme.colors.text;
        document.body.style.fontFamily = theme.styles.fontFamily;

        // Add theme-specific class to body
        document.body.className = '';
        document.body.classList.add(`theme-${themeName}`);

        // Update theme name display
        const themeNameElement = document.getElementById('current-theme-name');
        if (themeNameElement) {
            themeNameElement.textContent = theme.name;

            // Add theme indicator color
            const existingIndicator = themeNameElement.previousElementSibling;
            if (existingIndicator && existingIndicator.classList.contains('theme-indicator')) {
                existingIndicator.style.background = `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary})`;
            } else {
                const indicator = document.createElement('span');
                indicator.className = 'theme-indicator';
                indicator.style.background = `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary})`;
                themeNameElement.parentNode.insertBefore(indicator, themeNameElement);
            }
        }

        // Trigger custom event for theme change
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
    }

    // Load saved theme or default
    const savedTheme = localStorage.getItem('varnikakart-theme');
    if (savedTheme && themes[savedTheme]) {
        console.log('Loading saved theme:', savedTheme);
        applyTheme(savedTheme);

        // Update active state for desktop options
        themeOptions.forEach(opt => {
            if (opt.dataset.theme === savedTheme) {
                opt.classList.add('active');
            }
        });

        // Update active state for mobile options
        mobileThemeOptions.forEach(opt => {
            if (opt.dataset.theme === savedTheme) {
                opt.classList.add('active');
            }
        });
    } else {
        console.log('No saved theme, using default');
        applyTheme('artisanal-elegance');

        // Update active state for desktop options
        themeOptions.forEach(opt => {
            if (opt.dataset.theme === 'artisanal-elegance') {
                opt.classList.add('active');
            }
        });

        // Update active state for mobile options
        mobileThemeOptions.forEach(opt => {
            if (opt.dataset.theme === 'artisanal-elegance') {
                opt.classList.add('active');
            }
        });
    }
});
