FROM richarvey/nginx-php-fpm:3.1.6

# Put our app in the web root that nginx-php-fpm expects
WORKDIR /var/www/html
COPY . .

# Image config
# Let the base image run composer to install vendor/
ENV SKIP_COMPOSER 0
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root (if ever needed)
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]

