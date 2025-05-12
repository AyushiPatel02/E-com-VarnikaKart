/**
 * Enhanced Admin JavaScript for VarnikaKart
 * This file contains JavaScript functions to enhance the admin interface
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeComponents();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize animations
    initializeAnimations();
});

/**
 * Initialize all components
 */
function initializeComponents() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize popovers
    initializePopovers();
    
    // Initialize image previews
    initializeImagePreviews();
    
    // Initialize character counters
    initializeCharacterCounters();
    
    // Initialize slug generators
    initializeSlugGenerators();
    
    // Initialize status toggles
    initializeStatusToggles();
    
    // Initialize bulk actions
    initializeBulkActions();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize sortable tables
    initializeSortableTables();
    
    // Initialize responsive tables
    initializeResponsiveTables();
    
    // Initialize charts if available
    if (typeof Chart !== 'undefined') {
        initializeCharts();
    }
}

/**
 * Add event listeners
 */
function addEventListeners() {
    // Add event listener for form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields.', 'warning');
            }
        });
    });
    
    // Add event listener for delete confirmations
    const deleteButtons = document.querySelectorAll('.delete-confirm');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });
    
    // Add event listener for card hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
    });
}

/**
 * Initialize animations
 */
function initializeAnimations() {
    // Add animation classes to elements
    const elements = document.querySelectorAll('.animate');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, index * 100);
    });
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize popovers
 */
function initializePopovers() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

/**
 * Initialize image previews
 */
function initializeImagePreviews() {
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    imageInputs.forEach(input => {
        // Create preview container if it doesn't exist
        let previewContainer = input.nextElementSibling;
        if (!previewContainer || !previewContainer.classList.contains('image-preview-container')) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'image-preview-container mt-2';
            input.parentNode.insertBefore(previewContainer, input.nextSibling);
        }
        
        // Create preview image if it doesn't exist
        let previewImage = previewContainer.querySelector('.image-preview');
        if (!previewImage) {
            previewImage = document.createElement('img');
            previewImage.className = 'image-preview';
            previewImage.style.maxWidth = '100%';
            previewImage.style.maxHeight = '200px';
            previewImage.style.borderRadius = '0.25rem';
            previewImage.style.display = 'none';
            previewContainer.appendChild(previewImage);
        }
        
        // Add event listener for file selection
        input.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                previewImage.style.display = 'none';
            }
        });
        
        // Show existing image if available
        const existingImage = input.closest('.form-group').querySelector('a img');
        if (existingImage && existingImage.src) {
            previewImage.src = existingImage.src;
            previewImage.style.display = 'block';
        }
    });
}

/**
 * Initialize character counters
 */
function initializeCharacterCounters() {
    const textInputs = document.querySelectorAll('textarea, input[type="text"]');
    textInputs.forEach(input => {
        // Create counter element if it doesn't exist
        let counter = input.nextElementSibling;
        if (!counter || !counter.classList.contains('char-counter')) {
            counter = document.createElement('div');
            counter.className = 'char-counter text-muted mt-1';
            counter.innerHTML = `<small>${input.value.length} characters</small>`;
            input.parentNode.insertBefore(counter, input.nextSibling);
        }
        
        // Add event listener for input
        input.addEventListener('input', function() {
            const count = this.value.length;
            counter.innerHTML = `<small>${count} character${count !== 1 ? 's' : ''}</small>`;
        });
    });
}

/**
 * Initialize slug generators
 */
function initializeSlugGenerators() {
    const nameInputs = document.querySelectorAll('input[name="name"]');
    nameInputs.forEach(nameInput => {
        const slugInput = nameInput.closest('form').querySelector('input[name="slug"]');
        if (slugInput) {
            nameInput.addEventListener('blur', function() {
                if (!slugInput.value) {
                    const slug = this.value
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_-]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                    slugInput.value = slug;
                }
            });
        }
    });
}

/**
 * Show notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show notification`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add notification to the page
    const container = document.querySelector('.notifications-container');
    if (container) {
        container.appendChild(notification);
    } else {
        const newContainer = document.createElement('div');
        newContainer.className = 'notifications-container';
        newContainer.style.position = 'fixed';
        newContainer.style.top = '1rem';
        newContainer.style.right = '1rem';
        newContainer.style.zIndex = '9999';
        newContainer.style.maxWidth = '300px';
        document.body.appendChild(newContainer);
        newContainer.appendChild(notification);
    }
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
