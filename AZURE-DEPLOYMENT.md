# 🚀 Azure App Service Deployment Guide

This guide walks you through deploying your Laravel + Inertia.js (React/TypeScript) application to Azure App Service.

## 📋 Prerequisites

- Azure account with an active subscription
- GitHub repository connected (Maaz0313-png/maaz-tajammul)
- Azure CLI installed (optional, for command-line deployment)

## 🎯 Step-by-Step Deployment

### 1. Create Azure App Service

#### Via Azure Portal:

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"** → **"Web App"**
3. Configure Basic Settings:
    - **Subscription**: Select your subscription
    - **Resource Group**: Create new or select existing
    - **Name**: Choose a unique name (e.g., `maaz-tajammul`)
    - **Publish**: Code
    - **Runtime stack**: PHP 8.3
    - **Operating System**: Linux (recommended for Laravel)
    - **Region**: Choose closest to your users
    - **Pricing Plan**: Select appropriate plan (B1 or higher recommended)

4. Click **"Review + create"** → **"Create"**

#### Via Azure CLI:

```bash
# Login to Azure
az login

# Create resource group
az group create --name maaz-tajammul-rg --location eastus

# Create App Service plan
az appservice plan create --name maaz-tajammul-plan --resource-group maaz-tajammul-rg --sku B1 --is-linux

# Create Web App
az webapp create --name maaz-tajammul --resource-group maaz-tajammul-rg --plan maaz-tajammul-plan --runtime "PHP:8.3"
```

### 2. Configure GitHub Deployment

1. In Azure Portal, go to your Web App
2. Navigate to **"Deployment Center"** in the left menu
3. Select **"GitHub"** as the source
4. Click **"Authorize"** and sign in to GitHub
5. Select:
    - **Organization**: Maaz0313-png
    - **Repository**: maaz-tajammul
    - **Branch**: main
6. Click **"Save"**

Azure will automatically create a GitHub Actions workflow in your repository.

### 3. Configure Application Settings

1. Go to **"Configuration"** → **"Application settings"**
2. Add the following environment variables:

| Name                 | Value                                       | Notes                             |
| -------------------- | ------------------------------------------- | --------------------------------- |
| `APP_NAME`           | Maaz Tajammul                               | Your app name                     |
| `APP_ENV`            | production                                  | Environment                       |
| `APP_DEBUG`          | false                                       | Debug mode (false for production) |
| `APP_URL`            | https://maaz-tajammul.azurewebsites.net     | Your Azure URL                    |
| `DB_CONNECTION`      | sqlite                                      | Database driver                   |
| `DB_DATABASE`        | /home/site/wwwroot/database/database.sqlite | SQLite path                       |
| `SESSION_DRIVER`     | file                                        | Session driver                    |
| `CACHE_DRIVER`       | file                                        | Cache driver                      |
| `QUEUE_CONNECTION`   | sync                                        | Queue connection                  |
| `LOG_CHANNEL`        | stack                                       | Logging channel                   |
| `POST_BUILD_COMMAND` | npm run build                               | Build frontend assets             |

**Important**: The `APP_KEY` will be generated automatically by the startup script if not set.

3. Click **"Save"** at the top

### 4. Configure Startup Script

1. Still in **"Configuration"**
2. Go to **"General settings"** tab
3. Set **"Startup Command"**: `/home/site/wwwroot/startup.sh`
4. Click **"Save"**

### 5. Configure Document Root

The document root should point to the `/public` directory:

1. In **"Configuration"** → **"Path mappings"**
2. For Linux: The default document root is `/home/site/wwwroot`
3. Azure App Service on Linux uses Nginx. Create an Nginx configuration:

Go to **"Configuration"** → **"General settings"** → **"Startup Command"**:

```bash
cp /home/site/wwwroot/nginx.conf /etc/nginx/sites-available/default && /home/site/wwwroot/startup.sh
```

Or use the default configuration which should work with Laravel's `/public` directory.

**Alternative**: Use `.htaccess` (if on Windows) or create custom Nginx config.

### 6. Set PHP Extensions and Version

1. Go to **"Configuration"** → **"General settings"**
2. Verify **PHP version**: 8.3
3. Required PHP extensions (usually pre-installed):
    - OpenSSL
    - PDO
    - Mbstring
    - Tokenizer
    - XML
    - Ctype
    - JSON
    - BCMath
    - SQLite3
    - pdo_sqlite

### 7. Configure Storage Permissions

Azure App Service on Linux has persistent storage at `/home`. The startup script will handle permissions, but verify:

1. Go to **"Configuration"** → **"General settings"**
2. Ensure **"File system"** is enabled
3. The `/home` directory is persistent across deployments

### 8. First Deployment

After configuring GitHub deployment, Azure will automatically trigger a deployment. Monitor it:

1. Go to **"Deployment Center"** → **"Logs"**
2. Watch the build and deployment progress
3. Check for any errors

### 9. Manual Deployment Trigger (if needed)

If automatic deployment doesn't trigger:

```bash
# Via GitHub Actions
git add .
git commit -m "Configure Azure deployment"
git push origin main

# Or via Azure CLI
az webapp deployment source sync --name maaz-tajammul --resource-group maaz-tajammul-rg
```

### 10. Verify Deployment

1. Visit your app: `https://maaz-tajammul.azurewebsites.net`
2. Check logs if there are issues:
    - Azure Portal → Your Web App → **"Log stream"**
    - Or via CLI: `az webapp log tail --name maaz-tajammul --resource-group maaz-tajammul-rg`

## 🔧 Troubleshooting

### Issue: 500 Internal Server Error

**Solution**:

1. Enable debug mode temporarily: Set `APP_DEBUG=true` in Application Settings
2. Check logs: **"Diagnose and solve problems"** → **"Application Logs"**
3. Verify storage permissions
4. Ensure `.env` or Application Settings are correctly configured

### Issue: Assets Not Loading (404 for CSS/JS)

**Solution**:

1. Verify `npm run build` ran successfully during deployment
2. Check if `public/build` directory exists
3. Ensure `APP_URL` is set correctly
4. Run build command manually: SSH into container and run `npm run build`

### Issue: Database Migration Errors

**Solution**:

1. SSH into the container: Azure Portal → **"SSH"** or **"Advanced Tools (Kudu)"**
2. Navigate to `/home/site/wwwroot`
3. Run: `php artisan migrate --force`
4. Check database file permissions: `ls -la database/database.sqlite`

### Issue: Startup Script Not Running

**Solution**:

1. Verify startup command is set: `/home/site/wwwroot/startup.sh`
2. Check script permissions: `chmod +x startup.sh`
3. View startup logs: Azure Portal → **"Log stream"**

### Issue: Wayfinder Build Errors

**Solution**:
The `vite.config.ts` is already configured to skip wayfinder on Azure builds. If you still see errors:

1. Verify `WEBSITE_INSTANCE_ID` environment variable exists (Azure sets this automatically)
2. Ensure wayfinder generated files are committed to the repository
3. Run locally: `php artisan wayfinder:generate --with-form` and commit the files

## 📁 Project Files for Azure

### Files Created:

- ✅ `startup.sh` - Post-deployment optimization script
- ✅ `vite.config.ts` - Updated to skip wayfinder on Azure
- ✅ `AZURE-DEPLOYMENT.md` - This documentation

### Files to Check:

- `.env` or Azure Application Settings - Environment configuration
- `composer.json` - PHP dependencies
- `package.json` - Node.js dependencies and build scripts
- `database/database.sqlite` - Should exist and be writable

## 🌐 Custom Domain Setup (Optional)

To use your custom domain `maaztajammul.me`:

1. Go to **"Custom domains"** in Azure Portal
2. Click **"Add custom domain"**
3. Enter: `maaztajammul.me`
4. Follow the DNS configuration instructions:
    - Add CNAME record: `www` → `maaz-tajammul.azurewebsites.net`
    - Or A record pointing to Azure IP
5. Enable **"HTTPS"** via **"TLS/SSL settings"**

## 🔄 Continuous Deployment

Every push to `main` branch will automatically:

1. Trigger GitHub Actions workflow
2. Install Composer dependencies
3. Install npm dependencies
4. Build frontend assets (`npm run build`)
5. Deploy to Azure
6. Run startup script (migrations, cache, permissions)

## 📊 Monitoring and Logs

### View Logs:

```bash
# Real-time logs
az webapp log tail --name maaz-tajammul --resource-group maaz-tajammul-rg

# Download logs
az webapp log download --name maaz-tajammul --resource-group maaz-tajammul-rg
```

### Application Insights (Recommended):

1. Enable Application Insights in Azure Portal
2. Monitor performance, errors, and requests
3. Set up alerts for critical issues

## 💡 Performance Optimization

1. **Enable Caching**:
    - Consider Azure Redis Cache for session/cache storage
    - Update `CACHE_DRIVER=redis` and `SESSION_DRIVER=redis`

2. **CDN** (Optional):
    - Use Azure CDN for static assets
    - Update Vite config to use CDN URL

3. **Scale Up/Out**:
    - Vertical: Increase App Service Plan tier
    - Horizontal: Enable autoscaling in App Service Plan

## 🔐 Security Checklist

- ✅ `APP_DEBUG=false` in production
- ✅ Strong `APP_KEY` generated
- ✅ HTTPS enabled
- ✅ Proper file permissions (775 for storage, 664 for database)
- ✅ `.env` file not committed to repository
- ✅ Use Azure Key Vault for sensitive secrets (advanced)

## 📞 Support Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Laravel Deployment Documentation](https://laravel.com/docs/deployment)
- [Azure PHP Support](https://docs.microsoft.com/en-us/azure/app-service/configure-language-php)

---

**Deployment Date**: October 2, 2025  
**Laravel Version**: 11.x  
**PHP Version**: 8.3  
**Node.js Version**: 22.x  
**Database**: SQLite
