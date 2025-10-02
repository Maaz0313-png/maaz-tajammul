# Azure Deployment Files

This directory contains configuration files for Azure App Service deployment.

## Files:

- **nginx.conf** - Custom Nginx configuration for Laravel routing
    - Ensures all requests are routed through Laravel's `public/index.php`
    - Handles PHP-FPM processing
    - Denies access to hidden files (except `.well-known/`)

## Usage:

These files are automatically used by Azure App Service during deployment. The startup script in the root directory (`startup.sh`) handles the deployment process.

## Configuration:

If you need to customize Nginx configuration:

1. Edit `nginx.conf` in this directory
2. Commit changes to Git
3. Push to trigger Azure redeployment
4. Azure will automatically use the updated configuration

## Notes:

- The document root should be set to `/home/site/wwwroot/public`
- Azure App Service on Linux uses Nginx by default
- PHP 8.3-FPM is configured as the FastCGI processor
