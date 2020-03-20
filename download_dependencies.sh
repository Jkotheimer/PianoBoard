#!/usr/bin/env bash
GREEN="\033[0;32m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m"
DONE="\r[${GREEN}DONE${NC}]\n"
T="\t"

printf "${NC}${T}Fetching your mirror..."
curl -o ./mirrors.txt http://ws.apache.org/mirrors.cgi 2> /dev/null
MIRROR=$(grep -E '<p><a href=.*</strong></a>' mirrors.txt | cut -d '"' -f 2)
rm mirrors.txt
printf ${DONE}

ROOT_DIR=$(pwd)
rm -rf ./dependencies 2> /dev/null
mkdir -m 777 ./dependencies

if [ ! -f /tmp/httpd.tar.gz ]; then
	printf "${T}Downloading HTTPD..."
	sudo -u ${1} -H curl -o /tmp/httpd.tar.gz		${MIRROR}/httpd/httpd-2.4.41.tar.gz > /dev/null
	printf ${DONE}
fi

if [ ! -f /tmp/php.tar.gz ]; then
	printf "${T}Downloading PHP..."
	sudo -u ${1} -H curl -o /tmp/php.tar.gz			https://www.php.net/distributions/php-7.4.4.tar.gz > /dev/null
	printf ${DONE}
fi

printf "${T}Extracting HTTPD..."
sudo -u ${1} -H tar -xvzf /tmp/httpd.tar.gz		-C ./dependencies/ > /dev/null 2>&1
mkdir -m 777 ./dependencies/apache-httpd
HTTPD_SRC=${ROOT_DIR}/dependencies/httpd-2.4.41
HTTPD_HOME=${ROOT_DIR}/dependencies/apache-httpd
printf ${DONE}

printf "${T}Extracting PHP..."
sudo -u ${1} -H tar -xvzf /tmp/php.tar.gz		-C ./dependencies/ > /dev/null 2>&1
mkdir -m 777 ./dependencies/php
PHP_SRC=${ROOT_DIR}/dependencies/php-7.4.4
PHP_HOME=${ROOT_DIR}/dependencies/php
printf ${DONE}

printf "${T}Installing Apache Http Server..."
cd ${HTTPD_SRC}/
./configure --prefix=${HTTPD_HOME}/ --enable-so > /dev/null
make > /dev/null 2>&1
make install > /dev/null 2>&1
printf ${DONE}

printf "${T}Installing PHP..."
cd ${PHP_SRC}/
./configure --prefix=${PHP_HOME}/ --with-apxs2=${HTTPD_HOME}/bin/apxs --with-mysqli > /dev/null
make > /dev/null 2>&1
make install > /dev/null 2>&1
cp php.ini-development /usr/local/lib/php.ini
printf ${DONE}

printf "${T}Configuring PHP with HTTPD..."
rm -r ${HTTPD_SRC}/
rm -r ${PHP_SRC}/
HTTPD_CONF=${HTTPD_HOME}/conf/httpd.conf
echo "ServerName http://localhost:80
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_connect_module modules/mod_proxy_connect.so
ProxyPass			/api	http://localhost:8081/
ProxyPassReverse	/api	http://localhost:8081/
<FilesMatch \"\.ph(p[2-6]?|tml)$\">
	SetHandler application/x-httpd-php
</FilesMatch>
<Directory />
	DirectoryIndex index.php index.html
</Directory>
" >> ${HTTPD_CONF}
printf ${DONE}

sudo chmod -R 777 ./dependencies/

sudo ${HTTPD_HOME}/bin/apachectl start
