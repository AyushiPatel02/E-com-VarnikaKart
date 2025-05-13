/**
 * User Activity Chart
 * This script creates and manages the user activity chart on the user edit page
 */

// Initialize the user activity chart
function initUserActivityChart() {
    const ctx = document.getElementById('userActivityChart');
    
    if (!ctx) return;
    
    // Get activity data from the data attributes
    const loginData = JSON.parse(ctx.getAttribute('data-login-activity') || '[]');
    const orderData = JSON.parse(ctx.getAttribute('data-order-activity') || '[]');
    const reviewData = JSON.parse(ctx.getAttribute('data-review-activity') || '[]');
    
    // Format dates for better display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    // Get all unique dates from all datasets
    const allDates = [...new Set([
        ...loginData.map(item => item.date),
        ...orderData.map(item => item.date),
        ...reviewData.map(item => item.date)
    ])].sort();
    
    // Format all dates for display
    const labels = allDates.map(formatDate);
    
    // Create datasets with consistent dates
    const createDataset = (data, label, color) => {
        const counts = {};
        
        // Initialize all dates with zero
        allDates.forEach(date => {
            counts[date] = 0;
        });
        
        // Fill in actual values
        data.forEach(item => {
            counts[item.date] = item.count;
        });
        
        // Convert to array in the same order as labels
        return {
            label: label,
            data: allDates.map(date => counts[date]),
            backgroundColor: color + '33', // Add transparency
            borderColor: color,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
        };
    };
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                createDataset(loginData, 'Logins', '#4e73df'),
                createDataset(orderData, 'Orders', '#1cc88a'),
                createDataset(reviewData, 'Reviews', '#f6c23e')
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    cornerRadius: 4,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 7
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 2],
                        drawBorder: false
                    },
                    ticks: {
                        stepSize: 1,
                        padding: 10
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                line: {
                    tension: 0.3
                }
            }
        }
    });
    
    // Update chart when dark mode changes
    const updateChartTheme = (isDarkMode) => {
        chart.options.scales.x.ticks.color = isDarkMode ? '#adb5bd' : '#666';
        chart.options.scales.y.ticks.color = isDarkMode ? '#adb5bd' : '#666';
        chart.options.scales.x.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        chart.options.scales.y.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        chart.update();
    };
    
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    updateChartTheme(isDarkMode);
    
    // Listen for dark mode changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isDarkMode = document.documentElement.classList.contains('dark-mode');
                updateChartTheme(isDarkMode);
            }
        });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return chart;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initUserActivityChart();
});
