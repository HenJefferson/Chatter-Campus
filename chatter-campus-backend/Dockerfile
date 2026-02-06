FROM khromov/alpine-nginx-php8

# Put our app in the web root that nginx-php-fpm expects
WORKDIR /app

# Explicitly create essential Laravel directories with correct permissions
# The default user in php-fpm-alpine is 'root' during RUN commands.
# Let's ensure these are created and writable by www-data from the start.
RUN mkdir -p /app/storage /app/bootstrap/cache \
    && chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

COPY . .
RUN composer install --no-dev --optimize-autoloader

# Directly replace the default Nginx site config with ours
COPY nginx-site.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Image config
# Let the base image run composer to install vendor/
ENV SKIP_COMPOSER 0
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Enable verbose PHP error logging to stderr
ENV PHP_LOG_ERRORS_STDERR 1
ENV PHP_ERROR_REPORTING "E_ALL"

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Increase PHP upload limits for larger files
ENV PHP_UPLOAD_MAX_FILESIZE 200M
ENV PHP_POST_MAX_SIZE 200M

# Allow composer to run as root (if ever needed)
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]

