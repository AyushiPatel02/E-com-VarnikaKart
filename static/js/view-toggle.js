// View Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const productsContainer = document.getElementById('products-container');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const gridSizeBtns = document.querySelectorAll('.grid-size-btn');

    console.log('View Toggle JS loaded');
    console.log('Grid View Button:', gridViewBtn);
    console.log('List View Button:', listViewBtn);

    // Set initial state
    if (localStorage.getItem('productViewTypePreference') === 'list') {
        activateListView();
    } else {
        activateGridView();
    }

    // Add click event listeners
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            activateGridView();
        });
    }

    if (listViewBtn) {
        listViewBtn.addEventListener('click', function() {
            activateListView();
        });
    }

    // Grid size buttons
    gridSizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const gridSize = this.getAttribute('data-grid-size');

            // Remove active class from all grid size buttons
            gridSizeBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update grid size class on products container
            productsContainer.className = productsContainer.className
                .replace(/grid-size-\d+/g, '')
                .trim();
            productsContainer.classList.add(`grid-size-${gridSize}`);

            // Save preference to localStorage
            localStorage.setItem('productGridSizePreference', gridSize);

            // Show toast notification if function exists
            if (typeof showToast === 'function') {
                showToast(`Changed to ${gridSize} products per row`, 'info');
            }
        });
    });

    // Function to activate grid view
    function activateGridView() {
        // Update view buttons
        if (gridViewBtn) gridViewBtn.classList.add('active');
        if (listViewBtn) listViewBtn.classList.remove('active');

        // Update products container
        productsContainer.classList.remove('products-list-view');

        // Show grid size buttons
        gridSizeBtns.forEach(btn => {
            btn.style.display = 'inline-block';
        });

        // Apply saved grid size
        const savedGridSize = localStorage.getItem('productGridSizePreference') || '4';
        productsContainer.className = productsContainer.className
            .replace(/grid-size-\d+/g, '')
            .trim();
        productsContainer.classList.add(`grid-size-${savedGridSize}`);

        // Update active grid size button
        gridSizeBtns.forEach(btn => {
            if (btn.getAttribute('data-grid-size') === savedGridSize) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Save preference
        localStorage.setItem('productViewTypePreference', 'grid');

        // Show toast notification if function exists
        if (typeof showToast === 'function') {
            showToast('Switched to grid view', 'info');
        }
    }

    // Function to activate list view
    function activateListView() {
        // Update view buttons
        if (gridViewBtn) gridViewBtn.classList.remove('active');
        if (listViewBtn) listViewBtn.classList.add('active');

        // Update products container
        productsContainer.classList.add('products-list-view');

        // Hide grid size buttons
        gridSizeBtns.forEach(btn => {
            btn.style.display = 'none';
        });

        // Save preference
        localStorage.setItem('productViewTypePreference', 'list');

        // Show toast notification if function exists
        if (typeof showToast === 'function') {
            showToast('Switched to list view', 'info');
        }
    }
});
