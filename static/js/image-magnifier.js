/**
 * Image Magnifier for VarnikaKart
 * Enhanced image viewing with magnifier lens
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize image magnifier
    initImageMagnifier();
    
    // Listen for theme changes to reinitialize
    document.addEventListener('themeChanged', function() {
        initImageMagnifier();
    });
    
    // Listen for dark mode changes to reinitialize
    document.addEventListener('darkModeChanged', function() {
        initImageMagnifier();
    });
});

/**
 * Initialize image magnifier functionality
 */
function initImageMagnifier() {
    console.log('Initializing image magnifier');
    
    // Get all magnifier containers
    const magnifierContainers = document.querySelectorAll('.magnifier-container');
    
    magnifierContainers.forEach(container => {
        // Skip if already initialized
        if (container.getAttribute('data-magnifier-initialized')) return;
        
        // Mark as initialized
        container.setAttribute('data-magnifier-initialized', 'true');
        
        // Get image
        const image = container.querySelector('img');
        
        if (!image) return;
        
        // Create magnifier lens
        const lens = document.createElement('div');
        lens.className = 'magnifier-lens';
        container.appendChild(lens);
        
        // Add event listeners
        container.addEventListener('mousemove', function(e) {
            magnify(e, image, lens);
        });
        
        container.addEventListener('mouseenter', function() {
            lens.style.opacity = '1';
        });
        
        container.addEventListener('mouseleave', function() {
            lens.style.opacity = '0';
        });
        
        // Set up magnifier
        setupMagnifier(image, lens);
    });
}

/**
 * Set up magnifier lens
 * @param {Element} image - The image to magnify
 * @param {Element} lens - The magnifier lens
 */
function setupMagnifier(image, lens) {
    // Create new image for high-resolution version
    const highResImage = new Image();
    
    // Use data-high-res attribute if available, otherwise use original image
    highResImage.src = image.getAttribute('data-high-res') || image.src;
    
    // When high-res image is loaded
    highResImage.onload = function() {
        // Calculate zoom ratio
        const zoomRatio = highResImage.width / image.offsetWidth;
        
        // Store zoom ratio on lens
        lens.setAttribute('data-zoom-ratio', zoomRatio);
        
        // Set background image
        lens.style.backgroundImage = `url('${highResImage.src}')`;
    };
}

/**
 * Magnify image on mouse move
 * @param {Event} e - Mouse event
 * @param {Element} image - The image to magnify
 * @param {Element} lens - The magnifier lens
 */
function magnify(e, image, lens) {
    // Prevent default behavior
    e.preventDefault();
    
    // Get cursor position
    const pos = getCursorPos(e, image);
    
    // Calculate lens position
    let x = pos.x - (lens.offsetWidth / 2);
    let y = pos.y - (lens.offsetHeight / 2);
    
    // Prevent lens from going outside image
    x = Math.max(0, Math.min(x, image.offsetWidth - lens.offsetWidth));
    y = Math.max(0, Math.min(y, image.offsetHeight - lens.offsetHeight));
    
    // Set lens position
    lens.style.left = x + 'px';
    lens.style.top = y + 'px';
    
    // Get zoom ratio
    const zoomRatio = parseFloat(lens.getAttribute('data-zoom-ratio')) || 2;
    
    // Calculate background position
    const bgX = x * zoomRatio;
    const bgY = y * zoomRatio;
    
    // Set background position
    lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    lens.style.backgroundSize = (image.offsetWidth * zoomRatio) + 'px ' + (image.offsetHeight * zoomRatio) + 'px';
}

/**
 * Get cursor position relative to image
 * @param {Event} e - Mouse event
 * @param {Element} image - The image
 * @returns {Object} Cursor position {x, y}
 */
function getCursorPos(e, image) {
    // Get image position
    const rect = image.getBoundingClientRect();
    
    // Calculate cursor position relative to image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    return { x, y };
}

/**
 * Initialize 360 degree viewer
 */
function init360Viewer() {
    // Get all 360 viewers
    const viewers = document.querySelectorAll('.viewer-360');
    
    viewers.forEach(viewer => {
        // Skip if already initialized
        if (viewer.getAttribute('data-viewer-initialized')) return;
        
        // Mark as initialized
        viewer.setAttribute('data-viewer-initialized', 'true');
        
        // Get image
        const image = viewer.querySelector('img');
        
        if (!image) return;
        
        // Get image frames
        const frames = JSON.parse(viewer.getAttribute('data-frames') || '[]');
        
        if (frames.length === 0) return;
        
        // Create drag area
        const dragArea = document.createElement('div');
        dragArea.className = 'viewer-360-drag';
        viewer.appendChild(dragArea);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = 'viewer-360-indicator';
        indicator.innerHTML = '<i class="fas fa-sync-alt"></i> 360°';
        viewer.appendChild(indicator);
        
        // Create controls
        const controls = document.createElement('div');
        controls.className = 'viewer-360-controls';
        controls.innerHTML = `
            <div class="viewer-360-control viewer-360-prev"><i class="fas fa-chevron-left"></i></div>
            <div class="viewer-360-control viewer-360-play"><i class="fas fa-play"></i></div>
            <div class="viewer-360-control viewer-360-next"><i class="fas fa-chevron-right"></i></div>
        `;
        viewer.appendChild(controls);
        
        // Set up variables
        let currentFrame = 0;
        let isDragging = false;
        let startX = 0;
        let isPlaying = false;
        let playInterval;
        
        // Set initial frame
        image.src = frames[currentFrame];
        
        // Add event listeners for drag
        dragArea.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            dragArea.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            dragArea.style.cursor = 'grab';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // Calculate drag distance
            const deltaX = e.clientX - startX;
            
            // Determine direction
            if (Math.abs(deltaX) > 5) {
                if (deltaX > 0) {
                    // Dragging right, show previous frame
                    prevFrame();
                } else {
                    // Dragging left, show next frame
                    nextFrame();
                }
                
                // Update start position
                startX = e.clientX;
            }
        });
        
        // Add event listeners for controls
        const prevBtn = controls.querySelector('.viewer-360-prev');
        const playBtn = controls.querySelector('.viewer-360-play');
        const nextBtn = controls.querySelector('.viewer-360-next');
        
        prevBtn.addEventListener('click', prevFrame);
        nextBtn.addEventListener('click', nextFrame);
        playBtn.addEventListener('click', togglePlay);
        
        // Previous frame function
        function prevFrame() {
            currentFrame = (currentFrame - 1 + frames.length) % frames.length;
            image.src = frames[currentFrame];
        }
        
        // Next frame function
        function nextFrame() {
            currentFrame = (currentFrame + 1) % frames.length;
            image.src = frames[currentFrame];
        }
        
        // Toggle play function
        function togglePlay() {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                // Start auto-rotation
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playInterval = setInterval(nextFrame, 100);
            } else {
                // Stop auto-rotation
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(playInterval);
            }
        }
    });
}

/**
 * Initialize product video
 */
function initProductVideo() {
    // Get all product videos
    const videoContainers = document.querySelectorAll('.product-video');
    
    videoContainers.forEach(container => {
        // Skip if already initialized
        if (container.getAttribute('data-video-initialized')) return;
        
        // Mark as initialized
        container.setAttribute('data-video-initialized', 'true');
        
        // Get video
        const video = container.querySelector('video');
        
        if (!video) return;
        
        // Create play button
        const playBtn = document.createElement('div');
        playBtn.className = 'product-video-play';
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        container.appendChild(playBtn);
        
        // Create controls
        const controls = document.createElement('div');
        controls.className = 'product-video-controls';
        controls.innerHTML = `
            <div class="product-video-control product-video-play-pause"><i class="fas fa-play"></i></div>
            <div class="product-video-control product-video-mute"><i class="fas fa-volume-up"></i></div>
            <div class="product-video-control product-video-fullscreen"><i class="fas fa-expand"></i></div>
        `;
        container.appendChild(controls);
        
        // Add event listeners
        playBtn.addEventListener('click', function() {
            togglePlay();
        });
        
        video.addEventListener('click', function() {
            togglePlay();
        });
        
        const playPauseBtn = controls.querySelector('.product-video-play-pause');
        const muteBtn = controls.querySelector('.product-video-mute');
        const fullscreenBtn = controls.querySelector('.product-video-fullscreen');
        
        playPauseBtn.addEventListener('click', togglePlay);
        muteBtn.addEventListener('click', toggleMute);
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Toggle play function
        function togglePlay() {
            if (video.paused) {
                video.play();
                playBtn.style.opacity = '0';
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playBtn.style.opacity = '1';
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
        
        // Toggle mute function
        function toggleMute() {
            video.muted = !video.muted;
            
            if (video.muted) {
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        }
        
        // Toggle fullscreen function
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
    });
}
