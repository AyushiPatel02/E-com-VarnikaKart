# VarnikaKart - Handcrafted Artisan Marketplace

VarnikaKart is an e-commerce platform that connects talented Indian artisans with people who appreciate handcrafted quality and uniqueness. This Django-based application showcases handmade products from artisans across India, celebrating rich cultural heritage and craftsmanship.

## Features

- **Product Catalog**: Browse handcrafted items by category, material, or artisan
- **User Authentication**: Secure login, registration, and profile management
- **Shopping Cart**: Add products, manage quantities, and checkout
- **Order Management**: Track orders and view order history
- **Admin Dashboard**: Comprehensive admin interface for site management
- **Super Admin Portal**: Enhanced administrative capabilities for privileged users
- **Responsive Design**: Mobile-friendly interface for all devices

## Tech Stack

- **Backend**: Django 5.2+
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: django-allauth
- **Payment Processing**: Razorpay integration
- **Image Handling**: Pillow
- **Static File Optimization**: cssmin, jsmin, whitenoise

## Installation

### Prerequisites

- Python 3.10+
- pip
- virtualenv (recommended)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/varnikakart.git
   cd varnikakart
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create environment variables file:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your specific configuration.

5. Run migrations:
   ```
   python manage.py migrate
   ```

6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```
   python manage.py runserver
   ```

8. Visit http://127.0.0.1:8000/ in your browser.

## Project Structure

```
varnikakart/
├── core/                  # Core application with shared functionality
├── products/              # Product catalog management
├── orders/                # Order processing and management
├── users/                 # User profile and authentication
├── static/                # Static files (CSS, JS, images)
│   ├── img/               # Image assets
│   │   ├── artisans/      # Artisan profile images
│   │   ├── banners/       # Banner images
│   │   ├── blog/          # Blog post images
│   │   ├── categories/    # Category images
│   │   ├── hero/          # Hero section images
│   │   ├── materials/     # Material images
│   │   └── products/      # Product images
├── media/                 # User-uploaded content
├── templates/             # HTML templates
├── scripts/               # Utility scripts
└── varnikakart/           # Project settings
```

## Static Files

The project uses several image directories for different purposes:

- `static/img/products/`: Product images
- `static/img/artisans/`: Artisan profile images
- `static/img/hero/`: Hero section images
- `static/img/blog/`: Blog post images
- `static/img/categories/`: Category images
- `static/img/banners/`: Banner images
- `static/img/materials/`: Material images

Add actual image files to these directories for proper display.

## Static File Optimization

Run the optimization script to combine and minify CSS/JS files and optimize images:

```
python scripts/optimize_static.py
```

## Admin Access

- Regular admin: http://127.0.0.1:8000/admin/
- Super admin: http://127.0.0.1:8000/super-admin/

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

Password for superuser: Admin
Admin@#12



theme color : #d35f5f

- [Django](https://www.djangoproject.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [Razorpay](https://razorpay.com/)