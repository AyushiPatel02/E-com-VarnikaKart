"""
Static file optimization script for VarnikaKart.

This script:
1. Combines multiple CSS files into a single minified file
2. Combines multiple JS files into a single minified file
3. Optimizes images
"""

import os
import re
import glob
import shutil
from pathlib import Path
from datetime import datetime

# Try to import optional dependencies
try:
    import cssmin
    CSS_MINIFY_AVAILABLE = True
except ImportError:
    CSS_MINIFY_AVAILABLE = False
    print("cssmin not installed. CSS will be combined but not minified.")

try:
    import jsmin
    JS_MINIFY_AVAILABLE = True
except ImportError:
    JS_MINIFY_AVAILABLE = False
    print("jsmin not installed. JS will be combined but not minified.")

try:
    from PIL import Image
    IMAGE_OPTIMIZATION_AVAILABLE = True
except ImportError:
    IMAGE_OPTIMIZATION_AVAILABLE = False
    print("Pillow not installed. Image optimization will be skipped.")

# Get the base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Static directories
STATIC_DIR = os.path.join(BASE_DIR, 'static')
STATIC_DIST_DIR = os.path.join(BASE_DIR, 'static', 'dist')

# Create dist directory if it doesn't exist
os.makedirs(STATIC_DIST_DIR, exist_ok=True)

# CSS files to exclude from combination (will be copied as-is)
CSS_EXCLUDE = [
    'admin/css/custom_admin.css',
    'admin/css/super_admin.css',
]

# JS files to exclude from combination (will be copied as-is)
JS_EXCLUDE = [
    'admin/js/admin.js',
]

def combine_css_files():
    """Combine and minify CSS files."""
    print("Combining CSS files...")
    
    # Get all CSS files
    css_files = glob.glob(os.path.join(STATIC_DIR, 'css', '*.css'))
    
    # Filter out excluded files
    css_files = [f for f in css_files if not any(exclude in f for exclude in CSS_EXCLUDE)]
    
    # Sort files to ensure consistent order
    css_files.sort()
    
    # Create combined CSS content
    combined_css = ""
    for css_file in css_files:
        print(f"  Adding {os.path.basename(css_file)}")
        with open(css_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Add file name as comment
            combined_css += f"/* {os.path.basename(css_file)} */\n"
            combined_css += content + "\n\n"
    
    # Minify if available
    if CSS_MINIFY_AVAILABLE:
        print("  Minifying CSS...")
        minified_css = cssmin.cssmin(combined_css)
        # Add timestamp and file info at the top
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file_info = f"/* VarnikaKart combined CSS - Generated on {timestamp} */\n"
        combined_css = file_info + minified_css
    
    # Write combined CSS to file
    output_file = os.path.join(STATIC_DIST_DIR, 'varnikakart.min.css')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(combined_css)
    
    print(f"  Created {output_file}")
    
    # Copy excluded files
    for exclude in CSS_EXCLUDE:
        src = os.path.join(STATIC_DIR, exclude)
        if os.path.exists(src):
            # Create directory structure if needed
            dst_dir = os.path.join(STATIC_DIST_DIR, os.path.dirname(exclude))
            os.makedirs(dst_dir, exist_ok=True)
            
            dst = os.path.join(STATIC_DIST_DIR, exclude)
            shutil.copy2(src, dst)
            print(f"  Copied {exclude}")

def combine_js_files():
    """Combine and minify JS files."""
    print("Combining JS files...")
    
    # Get all JS files
    js_files = glob.glob(os.path.join(STATIC_DIR, 'js', '*.js'))
    
    # Filter out excluded files
    js_files = [f for f in js_files if not any(exclude in f for exclude in JS_EXCLUDE)]
    
    # Sort files to ensure consistent order
    js_files.sort()
    
    # Create combined JS content
    combined_js = ""
    for js_file in js_files:
        print(f"  Adding {os.path.basename(js_file)}")
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Add file name as comment
            combined_js += f"/* {os.path.basename(js_file)} */\n"
            combined_js += content + "\n\n"
    
    # Minify if available
    if JS_MINIFY_AVAILABLE:
        print("  Minifying JS...")
        minified_js = jsmin.jsmin(combined_js)
        # Add timestamp and file info at the top
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file_info = f"/* VarnikaKart combined JS - Generated on {timestamp} */\n"
        combined_js = file_info + minified_js
    
    # Write combined JS to file
    output_file = os.path.join(STATIC_DIST_DIR, 'varnikakart.min.js')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(combined_js)
    
    print(f"  Created {output_file}")
    
    # Copy excluded files
    for exclude in JS_EXCLUDE:
        src = os.path.join(STATIC_DIR, exclude)
        if os.path.exists(src):
            # Create directory structure if needed
            dst_dir = os.path.join(STATIC_DIST_DIR, os.path.dirname(exclude))
            os.makedirs(dst_dir, exist_ok=True)
            
            dst = os.path.join(STATIC_DIST_DIR, exclude)
            shutil.copy2(src, dst)
            print(f"  Copied {exclude}")

def optimize_images():
    """Optimize images for web."""
    if not IMAGE_OPTIMIZATION_AVAILABLE:
        return
    
    print("Optimizing images...")
    
    # Get all image files
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    image_files = []
    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(STATIC_DIR, '**', f'*{ext}'), recursive=True))
    
    # Create output directories
    for image_file in image_files:
        rel_path = os.path.relpath(image_file, STATIC_DIR)
        output_dir = os.path.join(STATIC_DIST_DIR, os.path.dirname(rel_path))
        os.makedirs(output_dir, exist_ok=True)
        
        output_file = os.path.join(STATIC_DIST_DIR, rel_path)
        
        # Optimize image
        try:
            img = Image.open(image_file)
            
            # Preserve PNG transparency
            if img.format == 'PNG':
                img.save(output_file, optimize=True, quality=85)
            else:
                img.save(output_file, optimize=True, quality=85)
                
            print(f"  Optimized {rel_path}")
        except Exception as e:
            print(f"  Error optimizing {rel_path}: {e}")
            # Copy original as fallback
            shutil.copy2(image_file, output_file)

def update_templates():
    """Update templates to use the combined files."""
    print("Updating base.html template...")
    
    base_template = os.path.join(BASE_DIR, 'templates', 'base.html')
    
    if not os.path.exists(base_template):
        print("  base.html not found. Skipping template update.")
        return
    
    with open(base_template, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create backup
    with open(f"{base_template}.bak", 'w', encoding='utf-8') as f:
        f.write(content)
    print("  Created backup at base.html.bak")
    
    # Replace multiple CSS links with the combined one
    css_pattern = r'(<!-- Custom CSS files -->.*?<!-- Additional CSS block for templates -->)'
    css_replacement = '<!-- Custom CSS files -->\n    <link rel="stylesheet" href="{% static \'dist/varnikakart.min.css\' %}">\n\n    <!-- Additional CSS block for templates -->'
    
    # Use re.DOTALL to make . match newlines
    content = re.sub(css_pattern, css_replacement, content, flags=re.DOTALL)
    
    # Replace multiple JS links with the combined one
    js_pattern = r'(<!-- Theme Switcher JS -->.*?<!-- Custom JS -->)'
    js_replacement = '<!-- Combined JS -->\n    <script src="{% static \'dist/varnikakart.min.js\' %}"></script>\n\n    <!-- Custom JS -->'
    
    # Use re.DOTALL to make . match newlines
    content = re.sub(js_pattern, js_replacement, content, flags=re.DOTALL)
    
    # Write updated content
    with open(base_template, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("  Updated base.html")

def main():
    """Main function to run the optimization process."""
    print("Starting static file optimization...")
    
    # Combine and minify CSS
    combine_css_files()
    
    # Combine and minify JS
    combine_js_files()
    
    # Optimize images
    optimize_images()
    
    # Update templates
    update_templates()
    
    print("Static file optimization complete!")

if __name__ == "__main__":
    main()
