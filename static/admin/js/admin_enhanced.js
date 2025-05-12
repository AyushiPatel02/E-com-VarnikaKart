// VarnikaKart Enhanced Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quick Actions Menu
    initQuickActions();
    
    // Initialize Enhanced Charts
    initEnhancedCharts();
    
    // Initialize Dark Mode Toggle
    initDarkMode();
    
    // Initialize Enhanced Form Validation
    initFormValidation();
    
    // Initialize Enhanced DataTables
    initEnhancedDataTables();
    
    // Initialize Tooltips and Popovers
    initTooltipsAndPopovers();
    
    // Initialize Notifications
    initNotifications();
});

// Quick Actions Menu
function initQuickActions() {
    // Create quick actions container if it doesn't exist
    if (!document.querySelector('.quick-actions')) {
        const quickActionsHTML = `
            <div class="quick-actions">
                <div class="quick-actions-toggle">
                    <i class="fas fa-bolt"></i>
                </div>
                <div class="quick-actions-menu">
                    <a href="/admin/products/product/add/" class="quick-actions-item">
                        <i class="fas fa-box"></i>
                        <span>Add Product</span>
                    </a>
                    <a href="/admin/orders/order/" class="quick-actions-item">
                        <i class="fas fa-shopping-cart"></i>
                        <span>View Orders</span>
                    </a>
                    <a href="/admin/auth/user/add/" class="quick-actions-item">
                        <i class="fas fa-user-plus"></i>
                        <span>Add User</span>
                    </a>
                    <a href="/admin/products/category/add/" class="quick-actions-item">
                        <i class="fas fa-tags"></i>
                        <span>Add Category</span>
                    </a>
                    <a href="/admin/sales_report/" class="quick-actions-item">
                        <i class="fas fa-chart-line"></i>
                        <span>Sales Report</span>
                    </a>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', quickActionsHTML);
        
        // Toggle quick actions menu
        const quickActionsToggle = document.querySelector('.quick-actions-toggle');
        const quickActionsMenu = document.querySelector('.quick-actions-menu');
        
        quickActionsToggle.addEventListener('click', function() {
            quickActionsMenu.classList.toggle('show');
        });
        
        // Close quick actions menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.quick-actions')) {
                quickActionsMenu.classList.remove('show');
            }
        });
    }
}

// Enhanced Charts
function initEnhancedCharts() {
    // Sales Chart with enhanced styling
    const salesChartCanvas = document.getElementById('salesChart');
    if (salesChartCanvas && typeof Chart !== 'undefined') {
        // Check if chart already initialized
        if (Chart.getChart(salesChartCanvas)) {
            Chart.getChart(salesChartCanvas).destroy();
        }
        
        // Get sales data
        const chartData = typeof salesData !== 'undefined' ? 
            (Array.isArray(salesData) ? 
                salesData.map(item => item.total || item) : 
                salesData) : 
            [65, 59, 80, 81, 56, 55, 40, 60, 75, 85, 90, 100];
        
        // Get labels
        const chartLabels = typeof salesData !== 'undefined' && Array.isArray(salesData) && salesData[0].month ? 
            salesData.map(item => item.month) : 
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const salesChart = new Chart(salesChartCanvas, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Sales',
                    data: chartData,
                    backgroundColor: 'rgba(211, 95, 95, 0.1)',
                    borderColor: '#d35f5f',
                    pointBackgroundColor: '#d35f5f',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#d35f5f',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 12,
                            font: {
                                size: 11,
                                family: "'Nunito', sans-serif"
                            }
                        }
                    },
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            font: {
                                size: 11,
                                family: "'Nunito', sans-serif"
                            },
                            callback: function(value) {
                                return '₹' + value;
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        bodyColor: '#858796',
                        titleColor: '#6e707e',
                        titleFont: {
                            size: 14,
                            family: "'Nunito', sans-serif"
                        },
                        bodyFont: {
                            family: "'Nunito', sans-serif"
                        },
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: false,
                        caretPadding: 10,
                        callbacks: {
                            label: function(context) {
                                return 'Sales: ₹' + context.raw;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Order Status Chart with enhanced styling
    const orderStatusChartCanvas = document.getElementById('orderStatusChart');
    if (orderStatusChartCanvas && typeof Chart !== 'undefined') {
        // Check if chart already initialized
        if (Chart.getChart(orderStatusChartCanvas)) {
            Chart.getChart(orderStatusChartCanvas).destroy();
        }
        
        const orderStatusChart = new Chart(orderStatusChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                datasets: [{
                    data: typeof ordersStatusData !== 'undefined' ? ordersStatusData : [25, 20, 30, 15, 10],
                    backgroundColor: [
                        '#e6b33e',
                        '#48cae4',
                        '#6a9b96',
                        '#38b000',
                        '#d35f5f'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        bodyColor: '#858796',
                        titleColor: '#6e707e',
                        titleFont: {
                            size: 14,
                            family: "'Nunito', sans-serif"
                        },
                        bodyFont: {
                            family: "'Nunito', sans-serif"
                        },
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: true,
                        caretPadding: 10
                    }
                }
            }
        });
    }
}

// Dark Mode Toggle
function initDarkMode() {
    // Add dark mode toggle to topbar if it doesn't exist
    const topbarNav = document.querySelector('.topbar-nav');
    if (topbarNav && !document.querySelector('.dark-mode-toggle')) {
        const darkModeToggleHTML = `
            <div class="dark-mode-toggle ms-2" title="Toggle Dark Mode">
                <i class="fas fa-moon"></i>
            </div>
        `;
        
        topbarNav.insertAdjacentHTML('beforeend', darkModeToggleHTML);
        
        // Toggle dark mode
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const body = document.body;
        
        // Check localStorage for dark mode
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').classList.remove('fa-moon');
            darkModeToggle.querySelector('i').classList.add('fa-sun');
        }
        
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            // Save state to localStorage
            localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
            
            // Update icon
            const icon = darkModeToggle.querySelector('i');
            if (body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }
}

// Enhanced Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form:not(.no-validation)');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add validation classes
            if (input.required && !input.classList.contains('form-control-required')) {
                input.classList.add('form-control-required');
                
                // Add required indicator to label
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (label && !label.querySelector('.required-indicator')) {
                    label.innerHTML += ' <span class="required-indicator text-danger">*</span>';
                }
            }
            
            // Add validation event listeners
            input.addEventListener('blur', function() {
                validateInput(input);
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('is-invalid')) {
                    validateInput(input);
                }
            });
        });
        
        // Form submit validation
        form.addEventListener('submit', function(event) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                event.preventDefault();
                event.stopPropagation();
                
                // Scroll to first invalid input
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
        });
    });
}

// Validate single input
function validateInput(input) {
    if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
        return true;
    }
    
    let isValid = true;
    const errorMessage = input.dataset.errorMessage || 'This field is required';
    
    // Remove existing feedback
    const existingFeedback = input.nextElementSibling;
    if (existingFeedback && existingFeedback.classList.contains('invalid-feedback')) {
        existingFeedback.remove();
    }
    
    // Check validity
    if (input.required && !input.value.trim()) {
        isValid = false;
    } else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
        isValid = false;
    }
    
    // Update classes
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        // Add feedback message
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = errorMessage;
        input.insertAdjacentElement('afterend', feedback);
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Enhanced DataTables
function initEnhancedDataTables() {
    if (typeof $.fn.DataTable !== 'undefined') {
        $.extend(true, $.fn.dataTable.defaults, {
            responsive: true,
            language: {
                search: "<i class='fas fa-search'></i>",
                searchPlaceholder: "Search...",
                lengthMenu: "_MENU_ records per page",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                infoEmpty: "Showing 0 to 0 of 0 entries",
                infoFiltered: "(filtered from _MAX_ total entries)",
                paginate: {
                    first: "<i class='fas fa-angle-double-left'></i>",
                    previous: "<i class='fas fa-angle-left'></i>",
                    next: "<i class='fas fa-angle-right'></i>",
                    last: "<i class='fas fa-angle-double-right'></i>"
                }
            },
            dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex align-items-center"l><"d-flex"f>>t<"d-flex justify-content-between align-items-center mt-3"<"text-muted"i><"pagination-container"p>>'
        });
    }
}

// Initialize Tooltips and Popovers
function initTooltipsAndPopovers() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            boundary: document.body
        });
    });
    
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl, {
            boundary: document.body
        });
    });
}

// Initialize Notifications
function initNotifications() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastContainerHTML = `<div class="toast-container position-fixed top-0 end-0 p-3"></div>`;
        document.body.insertAdjacentHTML('beforeend', toastContainerHTML);
    }
}

// Show notification toast
function showNotification(message, type = 'info', duration = 5000) {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'} me-2"></i>
            <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <small>Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: duration
    });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Expose functions globally
window.showNotification = showNotification;
