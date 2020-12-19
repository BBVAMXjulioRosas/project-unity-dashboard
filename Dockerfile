# ========= GENERATE SSL =========
FROM debian:buster as certificate-generator

WORKDIR /app/ssl

RUN mkdir key && mkdir csr && mkdir crt

RUN apt-get update && \
    apt-get install -y openssl && \
    openssl genrsa -out key/covidmx-ca.key 4096 && \
    openssl req -new -x509 -key key/covidmx-ca.key -out crt/covidmx-ca.crt \
        -subj "/emailAddress=info@globalincubator.com/C=MX/ST=Mexico/L=Mexico/O=covidmx/CN=covidmx.app" && \
    openssl x509 -in crt/covidmx-ca.crt -out crt/covidmx-ca.crt.pem -outform PEM && \
    openssl req -new -newkey rsa:2048 -nodes -out "csr/covidmx-back.csr" -keyout "key/covidmx-back.key" \
        -subj "/emailAddress=info@globalincubator.com/C=MX/ST=Mexico/L=Mexico/O=covidmx/CN=back.covidmx.app" && \
    openssl x509 -req -days 3600 -in "csr/covidmx-back.csr" -CA crt/covidmx-ca.crt.pem -CAkey key/covidmx-ca.key -CAcreateserial -out "crt/covidmx-back.crt" -sha256

# ========= PHP & Laravel Image =========

FROM php:7.2-apache

RUN apt update && apt upgrade -y

# 1. development packages
RUN apt install -y \
    git \
    zip \
    curl \
    sudo \
    unzip \
    libicu-dev \
    libbz2-dev \
    libpng-dev \
    libjpeg-dev \
    libmcrypt-dev \
    libreadline-dev \
    libfreetype6-dev \
    libxml2-dev \
    g++

# 2. apache configs + document root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/covid19mx/public
RUN sed -ri -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/sites-available/*.conf
RUN sed -ri -e "s!/var/www/!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 3. mod_rewrite for URL rewrite and mod_headers for .htaccess extra headers like Access-Control-Allow-Origin-
RUN a2enmod rewrite headers ssl

# 4. start with base php config, then add extensions
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN docker-php-ext-install \
    zip \
    bcmath \
    mbstring \
    ctype \
    fileinfo \
    json \
    pdo \
    tokenizer \
    xml

# 5. composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Clone project from Git (invalidate cache from here ON)
ARG CACHE_DATE=not_a_date
ARG git=git.globalincubator.net/santander/covid19mx
ARG gitTokenUser=gitlab+deploy+covid-docker
ARG gitToken=LiWC5w9ps6xmP4-szKwD
RUN git clone "https://${gitTokenUser}:${gitToken}@${git}.git"

# 7. Change workdir
WORKDIR /var/www/html/covid19mx

# 7.1 Copy .env configuration for laravel
COPY .env /var/www/html/covid19mx/.env

# 8. composer install
RUN composer install

# 8.1 Optimize Laravel
RUN php artisan optimize && \
    php artisan view:cache

# 9. Change permissions to apache user
RUN chown -R www-data:www-data /var/www/html/covid19mx

# 10. SSL Config
# Copy certificates
COPY --from=certificate-generator /app/ssl /etc/ssl
RUN chown -R www-data:www-data /etc/ssl

ENV CERTIFICATES_CONF="\n        SSLEngine On\n        SSLCertificateFile /etc/ssl/crt/covidmx-back.crt\n        SSLCertificateKeyFile /etc/ssl/key/covidmx-back.key\n        SSLCACertificateFile /etc/ssl/crt/covidmx-ca.crt"
RUN sed -ri -e "s!<VirtualHost \*:80>!<VirtualHost \*:443>${CERTIFICATES_CONF}!g" /etc/apache2/sites-available/*.conf
RUN sed -ri -e "s!#ServerName www\.example\.com!ServerName back\.covidmx\.app!g" /etc/apache2/sites-available/*.conf
