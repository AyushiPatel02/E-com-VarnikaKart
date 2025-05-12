// Category Admin JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize category list enhancements
    initCategoryList();
    
    // Initialize category form enhancements
    initCategoryForm();
});

/**
 * Initialize category list enhancements
 */
function initCategoryList() {
    // Add custom class to the category list table
    const table = document.querySelector('.results');
    if (table) {
        table.classList.add('category-list-table');
    }
    
    // Enhance status toggles
    const statusToggles = document.querySelectorAll('.status-toggle');
    statusToggles.forEach(toggle => {
        const row = toggle.closest('tr');
        if (toggle.checked) {
            row.classList.add('active-row');
        } else {
            row.classList.add('inactive-row');
        }
        
        toggle.addEventListener('change', function() {
            if (this.checked) {
                row.classList.remove('inactive-row');
                row.classList.add('active-row');
            } else {
                row.classList.remove('active-row');
                row.classList.add('inactive-row');
            }
        });
    });
    
    // Add confirmation for delete actions
    const deleteButtons = document.querySelectorAll('.delete-confirm');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });
    
    // Add bulk action confirmation
    const bulkActionButton = document.getElementById('bulk-action-apply');
    if (bulkActionButton) {
        bulkActionButton.addEventListener('click', function() {
            const action = document.getElementById('bulk-action-select').value;
            if (action === 'delete') {
                const selectedCount = document.querySelectorAll('.bulk-select-checkbox:checked').length;
                if (selectedCount > 0) {
                    if (!confirm(`Are you sure you want to delete ${selectedCount} categories? This action cannot be undone.`)) {
                        event.preventDefault();
                    }
                }
            }
        });
    }
}

/**
 * Initialize category form enhancements
 */
function initCategoryForm() {
    // Add preview functionality for category image
    const imageInput = document.querySelector('input[type="file"][name="image"]');
    if (imageInput) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview-container mt-2';
        
        // Create image preview element
        const previewImage = document.createElement('img');
        previewImage.className = 'image-preview';
        previewImage.style.maxWidth = '200px';
        previewImage.style.maxHeight = '200px';
        previewImage.style.display = 'none';
        
        // Add preview container after the image input
        imageInput.parentNode.appendChild(previewContainer);
        previewContainer.appendChild(previewImage);
        
        // Show preview when image is selected
        imageInput.addEventListener('change', function() {
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
        const currentImage = document.querySelector('.field-image a');
        if (currentImage && currentImage.href) {
            previewImage.src = currentImage.href;
            previewImage.style.display = 'block';
        }
    }
    
    // Add slug generator
    const nameInput = document.querySelector('input[name="name"]');
    const slugInput = document.querySelector('input[name="slug"]');
    if (nameInput && slugInput && !slugInput.value) {
        nameInput.addEventListener('blur', function() {
            if (!slugInput.value) {
                // Simple slug generator
                const slug = this.value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                slugInput.value = slug;
            }
        });
    }
    
    // Add character counter for description
    const descriptionTextarea = document.querySelector('textarea[name="description"]');
    if (descriptionTextarea) {
        const counterContainer = document.createElement('div');
        counterContainer.className = 'char-counter text-muted mt-1';
        counterContainer.innerHTML = `<small>0 characters</small>`;
        
        descriptionTextarea.parentNode.appendChild(counterContainer);
        
        descriptionTextarea.addEventListener('input', function() {
            const count = this.value.length;
            counterContainer.innerHTML = `<small>${count} character${count !== 1 ? 's' : ''}</small>`;
        });
        
        // Trigger initial count
        const event = new Event('input');
        descriptionTextarea.dispatchEvent(event);
    }
}

/**
 * Show notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add notification to the page
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(notification, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 150);
    }, 5000);
}
