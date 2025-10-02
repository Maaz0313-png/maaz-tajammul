# Laravel + SQLite on Vercel - CORRECTED Research Findings

**Date:** October 2, 2025  
**Research Method:** Playwright MCP Browser Analysis  
**Status:** ✅ SQLite IS Supported via PHP Runtime

---

## ✅ CRITICAL CORRECTION: SQLite IS Supported!

### PHP Runtime Extensions (vercel-php@0.7.4)

Source: https://github.com/vercel-community/php

**SQLite Extensions INCLUDED:**

- ✅ **`sqlite3`** - SQLite3 PHP extension
- ✅ **`pdo_sqlite`** - PDO driver for SQLite

**Full Extension List:**

> apcu, bcmath, brotli, bz2, calendar, Core, ctype, curl, date, dom, ds, exif, fileinfo, filter, ftp, geoip, gettext, hash, iconv, igbinary, imap, intl, json, libxml, lua, mbstring, mongodb, msgpack, mysqli, mysqlnd, openssl, pcntl, pcre, PDO, pdo_mysql, pdo_pgsql, **pdo_sqlite**, pgsql, phalcon, Phar, protobuf, readline, redis, Reflection, runkit7, session, SimpleXML, soap, sockets, sodium, SPL, **sqlite3**, standard, swoole, timecop, tokenizer, uuid, xml, xmlreader, xmlrpc, xmlwriter, xsl, Zend OPcache, zlib, zip

---

## 🎯 The REAL Challenge: Data Persistence

### What Works:

✅ SQLite **CAN** run on Vercel  
✅ PHP extensions are available  
✅ Database reads/writes work within a single request  
✅ Perfect for read-only/demo applications

### The Limitation:

❌ **Ephemeral Storage** - Data doesn't persist between:

- Function cold starts
- Deployments
- Scaling to multiple instances

---

## 💡 SQLite on Vercel: Use Cases

### ✅ WORKS GREAT FOR:

#### 1. **Read-Only Databases**

```php
// Deploy SQLite file with your code
DB_DATABASE=/var/task/database/database.sqlite
```

- Include pre-populated SQLite file in deployment
- Perfect for catalogs, documentation, reference data
- Fast reads, no external database needed

#### 2. **Demo/Prototype Applications**

- Quick prototypes
- Testing Laravel features
- Development/staging environments
- Temporary data is acceptable

#### 3. **Session Storage** (Short-term)

```php
// Use /tmp for temporary session data
DB_DATABASE=/tmp/sessions.sqlite
SESSION_DRIVER=database
```

- Works for single-session requests
- Not recommended for production

---

## ⚠️ DOESN'T WORK FOR:

### ❌ Production Applications Requiring:

1. **Persistent User Data**
    - User registrations
    - Content management
    - Transaction records

2. **Multi-Instance Consistency**
    - Data written in one instance won't appear in others
    - Race conditions possible

3. **Data Durability**
    - Uploads/user-generated content
    - Shopping carts
    - Any data that must survive deployments

---

## 🔧 Implementation Strategies

### Strategy 1: Read-Only SQLite (RECOMMENDED)

**Perfect for:** Static catalogs, documentation sites, reference apps

```json
// vercel.json
{
    "version": 2,
    "functions": {
        "api/index.php": {
            "runtime": "vercel-php@0.7.4"
        }
    }
}
```

```php
// config/database.php
'connections' => [
    'sqlite' => [
        'driver' => 'sqlite',
        'database' => database_path('database.sqlite'), // ✅ Read-only
        'foreign_key_constraints' => true,
    ],
]
```

**Deployment:**

1. Include `database/database.sqlite` in your repo
2. Run migrations/seeders locally before deploying
3. Deploy to Vercel
4. Database is read-only in production

---

### Strategy 2: Hybrid Approach

**Use SQLite for:** Configuration, cache, read-only data  
**Use Cloud DB for:** User data, sessions, dynamic content

```php
// .env (Vercel)
DB_CONNECTION=pgsql  // Primary database
DB_URL=postgresql://...

CACHE_CONNECTION=sqlite  // Local cache
CACHE_DATABASE=/tmp/cache.sqlite
```

---

### Strategy 3: /tmp Directory (Ephemeral)

**⚠️ WARNING: Data lost after ~15 minutes or on cold start**

```php
// config/database.php
'connections' => [
    'sqlite' => [
        'driver' => 'sqlite',
        'database' => '/tmp/database.sqlite',
    ],
]
```

**Bootstrap in `api/index.php`:**

```php
<?php
// Check if database exists, if not, create and seed it
$dbPath = '/tmp/database.sqlite';
if (!file_exists($dbPath)) {
    // Copy from read-only template
    copy(database_path('template.sqlite'), $dbPath);
    // Or run migrations
    Artisan::call('migrate:fresh', ['--force' => true]);
    Artisan::call('db:seed', ['--force' => true]);
}

require __DIR__ . '/../public/index.php';
```

**Use Case:** Demo apps where data reset is acceptable

---

## 📊 Vercel Storage Limits

| Storage Location | Size Limit | Persistence                           |
| ---------------- | ---------- | ------------------------------------- |
| `/var/task/`     | ~250MB     | ✅ Immutable (read-only after deploy) |
| `/tmp/`          | 512MB      | ❌ Ephemeral (~15min or cold start)   |

---

## 🚀 RECOMMENDED: Use External Database

For production Laravel apps on Vercel, use cloud databases:

### Option 1: **Turso** (SQLite-Compatible Cloud)

```bash
composer require tursodatabase/turso-driver-laravel
```

```env
DB_CONNECTION=libsql
DB_URL=libsql://your-db.turso.io
DB_AUTH_TOKEN=your-token
```

**Benefits:**

- ✅ SQLite syntax (familiar)
- ✅ Persistent storage
- ✅ Edge database (fast)
- ✅ Free tier available

### Option 2: **Supabase** (PostgreSQL)

```env
DB_CONNECTION=pgsql
DB_URL=postgresql://postgres:password@db.host.supabase.co:5432/postgres
```

### Option 3: **PlanetScale** (MySQL)

```env
DB_CONNECTION=mysql
DB_URL=mysql://user:pass@host.planetscale.com:3306/database
```

---

## 🎨 Recommended vercel.json Configuration

```json
{
    "version": 2,
    "framework": null,
    "functions": {
        "api/index.php": {
            "runtime": "vercel-php@0.7.4"
        }
    },
    "routes": [
        {
            "src": "/build/(.*)",
            "dest": "/public/build/$1"
        },
        {
            "src": "/(css|js|images|fonts|svg|favicon.ico|robots.txt|apple-touch-icon.png|logo.svg)/(.*)",
            "dest": "/public/$1/$2"
        },
        {
            "src": "/(.*)",
            "dest": "/api/index.php"
        }
    ],
    "env": {
        "APP_ENV": "production",
        "APP_DEBUG": "false",
        "APP_KEY": "base64:your-app-key",
        "APP_URL": "https://your-domain.vercel.app",
        "APP_CONFIG_CACHE": "/tmp/config.php",
        "APP_EVENTS_CACHE": "/tmp/events.php",
        "APP_PACKAGES_CACHE": "/tmp/packages.php",
        "APP_ROUTES_CACHE": "/tmp/routes.php",
        "APP_SERVICES_CACHE": "/tmp/services.php",
        "VIEW_COMPILED_PATH": "/tmp",
        "CACHE_DRIVER": "array",
        "LOG_CHANNEL": "stderr",
        "SESSION_DRIVER": "cookie"
    },
    "buildCommand": "npm run build:ssr",
    "devCommand": "php artisan serve"
}
```

---

## ✅ YOUR PROJECT: Next Steps

### For Read-Only SQLite:

1. Keep SQLite database in `database/database.sqlite`
2. Commit it to git
3. Set `DB_DATABASE=database_path('database.sqlite')` in config
4. Deploy to Vercel
5. ✅ Works perfectly!

### For Dynamic Data:

1. **Choose cloud database:** Turso (recommended for SQLite syntax)
2. **Install driver:**

    ```bash
    composer require tursodatabase/turso-driver-laravel
    ```

3. **Update .env for Vercel:**

    ```env
    DB_CONNECTION=libsql
    DB_URL=libsql://your-db.turso.io
    DB_AUTH_TOKEN=your-token
    ```

4. **Deploy & migrate:**
    ```bash
    # Add to vercel.json or GitHub Actions
    php artisan migrate --force
    ```

---

## 📝 Summary

**The user was RIGHT:**

- ✅ SQLite IS supported in Vercel PHP runtime
- ✅ `sqlite3` and `pdo_sqlite` extensions are available
- ✅ Perfect for read-only databases

**The limitation is:**

- ❌ Ephemeral storage (data doesn't persist)
- ✅ Solution: Use cloud database for dynamic data

**Best practice for your project:**

- Read-only data → Use local SQLite ✅
- Dynamic data → Use Turso/Supabase/PlanetScale ✅
- Hybrid → Use both! ✅

---

## 🔗 Resources

- **PHP Runtime:** https://github.com/vercel-community/php
- **Turso (SQLite Cloud):** https://turso.tech
- **Laravel Examples:** https://github.com/juicyfx/vercel-examples
- **Caleb Porzio's Guide:** https://calebporzio.com/easy-free-serverless-laravel-with-vercel

---

**Research completed using Playwright MCP Browser**  
**Thank you for the correction! 🙏**
