/**
 * DataTable Utilities
 * This file contains utility functions for DataTables to prevent re-initialization errors
 */

// Initialize DataTables safely (prevents "Cannot reinitialise DataTable" error)
function initDataTables(selector = '.datatable', options = {}) {
    const tables = document.querySelectorAll(selector);
    
    if (tables.length > 0 && typeof $.fn !== 'undefined' && $.fn.DataTable) {
        tables.forEach(table => {
            // Check if DataTable is already initialized on this table
            if (!$.fn.dataTable.isDataTable(table)) {
                // Default options
                const defaultOptions = {
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search...",
                        lengthMenu: "Show _MENU_ entries",
                        info: "Showing _START_ to _END_ of _TOTAL_ entries",
                        infoEmpty: "Showing 0 to 0 of 0 entries",
                        infoFiltered: "(filtered from _MAX_ total entries)",
                        paginate: {
                            first: '<i class="fas fa-angle-double-left"></i>',
                            previous: '<i class="fas fa-angle-left"></i>',
                            next: '<i class="fas fa-angle-right"></i>',
                            last: '<i class="fas fa-angle-double-right"></i>'
                        }
                    }
                };
                
                // Merge default options with provided options
                const mergedOptions = { ...defaultOptions, ...options };
                
                // Initialize DataTable
                $(table).DataTable(mergedOptions);
            }
        });
    }
}

// Destroy DataTables safely
function destroyDataTables(selector = '.datatable') {
    const tables = document.querySelectorAll(selector);
    
    if (tables.length > 0 && typeof $.fn !== 'undefined' && $.fn.DataTable) {
        tables.forEach(table => {
            // Check if DataTable is initialized on this table
            if ($.fn.dataTable.isDataTable(table)) {
                // Destroy DataTable
                $(table).DataTable().destroy();
            }
        });
    }
}

// Refresh DataTables safely
function refreshDataTables(selector = '.datatable', options = {}) {
    // First destroy existing DataTables
    destroyDataTables(selector);
    
    // Then initialize them again
    initDataTables(selector, options);
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all DataTables with default options
    initDataTables();
});
