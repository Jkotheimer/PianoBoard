FROM ubuntu:20.04 AS dev
MAINTAINER Jack Kotheimer
LABEL app.pianoboard.version="0.0.1-beta"

EXPOSE 80/tcp
EXPOSE 3306/tcp

COPY ./api /var/www/api
COPY ./client /var/www/html
COPY ./config/dev /var/www/config

ENV DEBIAN_FRONTEND noninteractive
ENV PHP_TIMEZONE America/Chicago
ENV PHP_POST_MAX_SIZE 5M
ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV NODE_PATH /node_modules

RUN apt-get -y update;

# Install all server dependencies
RUN apt-get -y install curl passenger nodejs npm mysql-server nginx php php-fpm php-mysql; \
	npm install express cookie-parser fs path email-validator mysql; \
	npm install pm2 -g; \
	chown -R www-data /var/www/*; \
	usermod -d /var/lib/mysql/ mysql; \
	chmod +x /var/www/config/deploy.sh; \
	ln -sf /var/www/config/nginx-site.conf /etc/nginx/sites-enabled/default; \
	ln -sf /var/www/config/php.ini /etc/php/7.4/apache2/php.ini;
