#!/usr/bin/env bash

conf=/etc/apache2/apache2.conf
original=/etc/apache2/apache2.original
cp $conf "$conf.backup"
if [ -f $original ]; then
	cp $original $conf
else
	cp $conf $original
fi

a2enmod proxy_http
a2enmod rewrite

echo "
ProxyPass /api http://127.0.0.1:8081
ProxyPassReverse /api http://127.0.0.1:8081
<Directory \"/var/www/html/resources/php\">
	Require all denied
</Directory>
<Files \"*.phpsecret\">
	Require all denied
</Files>
RewriteEngine On
RewriteCond %{DOCUMENT_ROOT}/\$1 !-f
RewriteCond %{DOCUMENT_ROOT}/\$1 !-d
RewriteRule ^\/users\/(\w+)\/?(\w*)?\/?(\w*)?\/?(\w*)?\/?(\w*)\/?$ /accounts.php?account=\$1&project=\$2&track=\$3&recording=\$4&note=\$5 [P]
" >> /etc/apache2/apache2.conf

service apache2 restart
