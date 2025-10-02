#!/bin/bash

echo "Starting Laravel application startup script..."

# Navigate to application directory
cd /home/site/wwwroot

# Wait for file system to be ready
sleep 5

# Set proper permissions for Laravel directories
echo "Setting permissions..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Create SQLite database if it doesn't exist
if [ ! -f database/database.sqlite ]; then
    echo "Creating SQLite database..."
    touch database/database.sqlite
    chmod 664 database/database.sqlite
    chown www-data:www-data database/database.sqlite
fi

# Clear and cache Laravel configurations
echo "Optimizing Laravel..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (use --force for production)
echo "Running migrations..."
php artisan migrate --force

# Generate application key if not set
if grep -q "APP_KEY=$" .env 2>/dev/null || [ ! -f .env ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

echo "Startup script completed successfully!"
