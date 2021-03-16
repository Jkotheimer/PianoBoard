FROM ubuntu:20.04 AS dev
MAINTAINER Jack Kotheimer
LABEL app.pianoboard.version="0.0.1-beta"

EXPOSE 80/tcp

ARG ENV

ENV DEBIAN_FRONTEND noninteractive
ENV PHP_TIMEZONE America/Chicago
ENV PHP_POST_MAX_SIZE 5M
ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV NODE_PATH /node_modules

RUN apt-get -y update;

# Removable tools for development
RUN apt-get -y install net-tools vim mysql-client;

# Install all server dependencies
RUN apt-get -y install curl passenger nodejs npm nginx php php-fpm php-mysql php-curl; \
	npm install express cookie-parser fs path email-validator mysql; \
	npm install pm2 -g; \
	chmod +x /var/www/; \
	chown -R www-data:www-data /var/www/;

COPY . /var/www/
