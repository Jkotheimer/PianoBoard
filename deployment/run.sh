#!/usr/bin/env bash

[ -z "$ENV" ] && ENV=dev

# Wait for a successful MySQL connection (deployment is dependent on this)
while ! mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -h "$MYSQL_HOST" -P $MYSQL_PORT; do
	echo "Mysql connection is pending. Trying again in 5 seconds..."
	sleep 5
done

# Symlink all the proper config files
ln -sf /var/www/deployment/$ENV/nginx.conf /etc/nginx/nginx.conf;
ln -sf /var/www/deployment/$ENV/php.ini /etc/php/7.4/apache2/php.ini;

# Ensure nginx, php, and the api cluster are all running
service php7.4-fpm status || service php7.4-fpm start || echo 'ERR: php7.4-fpm service failed to start'
service nginx status && service nginx restart || service nginx start || echo 'ERR: nginx service failed to start'
cd /var/www/api
pm2 status && pm2 reload all || pm2 start app.js -i 4 -f -l /var/log/nginx/api.log || echo 'ERR: pm2 worker failed to start api'

# Keep the container alive indefinitely
echo 'Container is alive and running!'
echo 'Tailing nginx error.log ...'
tail -f /var/log/nginx/*
while true; do printf ''; done
