FROM ubuntu:20.04 AS dev
MAINTAINER Jack Kotheimer
LABEL app.pianoboard.version="0.0.1-beta"

EXPOSE 80/tcp

ARG ENV

COPY ./api /var/www/api
COPY ./client /var/www/html
COPY ./deployment/$ENV /var/www/deployment

ENV DEBIAN_FRONTEND noninteractive
ENV PHP_TIMEZONE America/Chicago
ENV PHP_POST_MAX_SIZE 5M
ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV NODE_PATH /node_modules

RUN apt-get -y update;

# Install all server dependencies
RUN apt-get -y install curl passenger nodejs npm nginx php php-fpm php-mysql php-curl; \
	npm install express cookie-parser fs path email-validator mysql; \
	npm install pm2 -g;

# Configure all services
RUN chown -R www-data /var/www/*; \
	chmod +x /var/www/config/deploy.sh; \
	ln -sf /var/www/deployment/nginx-site.conf /etc/nginx/sites-enabled/default; \
	ln -sf /var/www/deployment/php.ini /etc/php/7.4/apache2/php.ini;
