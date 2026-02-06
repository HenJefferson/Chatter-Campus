FROM khromov/alpine-nginx-php8

# Put our app in the web root that nginx-php-fpm expects
WORKDIR /var/www/html

# Explicitly create Laravel-specific writable directories and set ownership for the 'nobody' user
# This ensures that these directories are ready for the 'nobody' user (which Nginx/PHP-FPM will use)
# and for composer install to write logs/cache.
RUN mkdir -p /var/www/html/storage/logs /var/www/html/bootstrap/cache \
    && chown -R nobody:nobody /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

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

