#!/usr/bin/env bash

# Ensure nginx, php, and the api cluster are all running
service php7.4-fpm status || service php7.4-fpm start || echo 'php7.4-fpm service failed to start'
service nginx status && service nginx restart || service nginx start || echo 'nginx service failed to start'
cd /var/www/api
pm2 status && pm2 reload all || pm2 start app.js -i 4 -f || echo 'pm2 worker failed to start api'

# Keep the container alive indefinitely
echo 'Container is alive and running!'
echo 'Tailing nginx error.log ...'
tail -f /var/log/nginx/error.log
while true; do printf ''; done
