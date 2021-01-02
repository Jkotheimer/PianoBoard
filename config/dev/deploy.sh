#!/usr/bin/env bash

# Ensure php and mysql are running
service php7.4-fpm status || service php7.4-fpm start || exit 1
service mysql status || service mysql start || exit 2

# Ensure mysql has the proper user and database
if ! echo "SELECT User FROM mysql.user" | mysql | grep "$DB_USER" &>/dev/null; then
	echo "CREATE USER IF NOT EXISTS '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASSWORD';" | mysql
	echo "GRANT ALL ON *.* TO '$DB_USER'@'$DB_HOST';" | mysql
	echo "CREATE DATABASE IF NOT EXISTS $DB_NAME" | mysql -u"$DB_USER" -p"$DB_PASSWORD" -h"$DB_HOST" -P "$DB_PORT"
fi

# Ensure nginx and the api cluster is running
service nginx status && service nginx restart || service nginx start || exit 3
cd /var/www/api
pm2 status && pm2 reload all || pm2 start app.js -i 4 -f
