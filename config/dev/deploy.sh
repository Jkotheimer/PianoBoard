#!/usr/bin/env bash

# Copy all required config files
cp /var/www/config/apache2.conf /etc/apache2/apache2.conf
cp /var/www/config/000-default.conf /etc/apache2/sites-enabled/000-default.conf
cp /var/www/config/php.ini /etc/php/7.4/apache2/php.ini

# From mattraynor/lamp
/run.sh 7.4

#Start the api
node /var/www/api/app.js &

