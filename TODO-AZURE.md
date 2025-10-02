# Azure Deployment TODO

## ✅ Completed Steps:

- [x] Created `startup.sh` for post-deployment tasks
- [x] Updated `vite.config.ts` to detect Azure environment
- [x] Created comprehensive `AZURE-DEPLOYMENT.md` guide
- [x] Added Node.js engines specification to `package.json`
- [x] Created `.azure/nginx.conf` for custom routing
- [x] Wayfinder generated files already committed

## 🔄 Manual Steps Required:

### 1. Create Azure App Service

- [ ] Sign in to Azure Portal (https://portal.azure.com)
- [ ] Create new Web App with PHP 8.3 runtime on Linux
- [ ] Choose appropriate pricing tier (B1 or higher)

### 2. Configure Application Settings

Add these environment variables in Azure Portal → Configuration:

- [ ] `APP_NAME=Maaz Tajammul`
- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false`
- [ ] `APP_URL=https://[your-app].azurewebsites.net`
- [ ] `DB_CONNECTION=sqlite`
- [ ] `DB_DATABASE=/home/site/wwwroot/database/database.sqlite`
- [ ] `SESSION_DRIVER=file`
- [ ] `CACHE_DRIVER=file`
- [ ] `POST_BUILD_COMMAND=npm run build`

### 3. Configure GitHub Deployment

- [ ] Go to Deployment Center in Azure Portal
- [ ] Select GitHub as source
- [ ] Authorize and connect to Maaz0313-png/maaz-tajammul repository
- [ ] Select main branch
- [ ] Save configuration

### 4. Set Startup Script

- [ ] In Configuration → General settings
- [ ] Set Startup Command: `/home/site/wwwroot/startup.sh`
- [ ] Save changes

### 5. Verify Deployment

- [ ] Monitor deployment in Deployment Center → Logs
- [ ] Check Log stream for any errors
- [ ] Visit your Azure URL to test the application
- [ ] Verify database migrations ran successfully
- [ ] Test user registration/login functionality

## 📝 Next Steps After Deployment:

### Performance Optimization:

- [ ] Consider enabling Azure CDN for static assets
- [ ] Set up Application Insights for monitoring
- [ ] Configure autoscaling if needed

### Custom Domain (Optional):

- [ ] Add custom domain `maaztajammul.me` in Azure Portal
- [ ] Configure DNS records (CNAME or A record)
- [ ] Enable HTTPS certificate

### Security:

- [ ] Review security settings
- [ ] Enable managed identity (if using Azure services)
- [ ] Set up Azure Key Vault for secrets (advanced)

## 🐛 Common Issues and Solutions:

### If deployment fails:

1. Check GitHub Actions workflow logs
2. Review Azure deployment logs in Deployment Center
3. SSH into container to debug: Azure Portal → SSH
4. Check file permissions: `ls -la storage/ bootstrap/cache/`

### If assets not loading:

1. Verify `POST_BUILD_COMMAND=npm run build` is set
2. Check if `public/build/` directory exists after deployment
3. Ensure `APP_URL` matches your Azure URL

### If database errors:

1. SSH into container
2. Check database file: `ls -la database/database.sqlite`
3. Run migrations manually: `php artisan migrate --force`
4. Check permissions: `chmod 664 database/database.sqlite`

## 📚 Documentation:

- Full guide: `AZURE-DEPLOYMENT.md`
- Azure docs: https://docs.microsoft.com/azure/app-service/
- Laravel deployment: https://laravel.com/docs/deployment

---

**Status**: Ready for Azure deployment
**Date**: October 2, 2025
