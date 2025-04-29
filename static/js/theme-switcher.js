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
    if (!themes[themeName]) {
        console.error('Theme not found:', themeName);
        return;
    }
    
    const theme = themes[themeName];
    currentTheme = themeName;
    
    // Save theme preference to localStorage
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
    
    // Update theme name in the UI
    const themeNameElement = document.getElementById('current-theme-name');
    if (themeNameElement) {
        themeNameElement.textContent = theme.name;
    }
    
    // Update active theme in the theme switcher
    document.querySelectorAll('.theme-option').forEach(option => {
        if (option.dataset.theme === themeName) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Add theme-specific class to body
    document.body.className = '';
    document.body.classList.add(`theme-${themeName}`);
    
    // Trigger custom event for theme change
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
}

// Initialize theme switcher
function initThemeSwitcher() {
    // Create theme switcher container
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = `
        <button class="theme-toggle-btn" aria-label="Toggle theme switcher">
            <i class="fas fa-palette"></i>
        </button>
        <div class="theme-panel">
            <div class="theme-panel-header">
                <h5>Choose a Theme</h5>
                <button class="theme-panel-close" aria-label="Close theme panel">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="theme-options">
                ${Object.keys(themes).map(key => `
                    <div class="theme-option" data-theme="${key}">
                        <div class="theme-preview" style="background-color: ${themes[key].colors.primary}"></div>
                        <div class="theme-info">
                            <h6>${themes[key].name}</h6>
                            <p>${themes[key].description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(themeSwitcher);
    
    // Add event listeners
    const toggleBtn = themeSwitcher.querySelector('.theme-toggle-btn');
    const closeBtn = themeSwitcher.querySelector('.theme-panel-close');
    const themeOptions = themeSwitcher.querySelectorAll('.theme-option');
    
    toggleBtn.addEventListener('click', () => {
        themeSwitcher.classList.toggle('open');
    });
    
    closeBtn.addEventListener('click', () => {
        themeSwitcher.classList.remove('open');
    });
    
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const themeName = option.dataset.theme;
            applyTheme(themeName);
            themeSwitcher.classList.remove('open');
        });
    });
    
    // Load saved theme or use default
    const savedTheme = localStorage.getItem('varnikakart-theme');
    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
    } else {
        applyTheme(currentTheme);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initThemeSwitcher);
