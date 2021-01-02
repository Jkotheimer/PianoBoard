#!/usr/bin/env bash

service php7.4-fpm status || service php7.4-fpm start
service api status || service api start
service mysql status || service mysql start
service nginx status || service nginx start
node /var/www/api/app.js &
