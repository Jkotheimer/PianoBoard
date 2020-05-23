#!/usr/bin/env bash

printf "\tLocating project root and creating dependencies directory..."
cd ../"$( dirname "${BASH_SOURCE[0]}" )" > /dev/null 2>&1
source ./_scripts/functions.sh
DEP_DIR=$(pwd)/_dependencies
CLIENT_DIR=$(pwd)/_client
SRV_DIR=$(pwd)/_server
ROOT_DIR=$(pwd)
rm -rf ${DEP_DIR} 2> /dev/null
mkdir ${DEP_DIR}
printf "$DONE"

if [ ! $(exists mysql) ]; then
	printf "\n[\033[0;31mERROR\033[0m] Please install mysql before installing this package\n"
	exit -1
fi

printf "${T}Fetching your mirror..."
handle_error "$(curl -o ./mirrors.txt http://ws.apache.org/mirrors.cgi 2>&1)"
MIRROR=$(grep -E '<p><a href=.*</strong></a>' mirrors.txt | cut -d '"' -f 2)
rm mirrors.txt
printf "$DONE"

# DOWNLOAD AND INSTALL HTTPD
HTTPD_HOME=${DEP_DIR}/httpd
download_dependency httpd ${MIRROR}/httpd/httpd-2.4.43.tar.gz
extract_dependency httpd ${DEP_DIR}
install_dependency ${DEP_DIR}/httpd-* \
	"--prefix=${HTTPD_HOME} --enable-so" \
	$()

# DOWNLOAD AND INSTALL PHP
download_dependency php https://www.php.net/distributions/php-7.4.4.tar.gz
extract_dependency php ${DEP_DIR}
install_dependency ${DEP_DIR}/php-* \
	"--prefix=${DEP_DIR}/php/ --with-apxs2=${HTTPD_HOME}/bin/apxs --with-mysqli" \
	$(cp php.ini-development /usr/local/lib/php.ini 2> /dev/null; cd ${ROOT_DIR})

printf "${T}Configuring PHP with HTTPD..."
HTTPD_CONF=${HTTPD_HOME}/conf/httpd.conf
uncomment mod_proxy.so ${HTTPD_CONF}
uncomment mod_proxy_http.so ${HTTPD_CONF}
uncomment mod_proxy_connect.so ${HTTPD_CONF}
uncomment mod_rewrite.so ${HTTPD_CONF}
sed -i "s|_dependencies/httpd/htdocs|_client|g" ${HTTPD_CONF}
sed -i "s|daemon|${1}|g" ${HTTPD_CONF}
echo "
ServerName 127.0.0.1:80
ProxyPass			/api	http://localhost:8081
ProxyPassReverse	/api	http://localhost:8081
<FilesMatch \"\.ph(p[2-6]?|tml)$\">
	SetHandler application/x-httpd-php
</FilesMatch>
<Directory />
	DirectoryIndex index.php index.html
</Directory>
<Files \"*.phpsecret\">
	Require all denied
</Files>
<Directory \"${ROOT_DIR}/_client/resources\">
	Require all denied
</Directory>
RewriteEngine On
RewriteCond %{DOCUMENT_ROOT}/\$1 !-f 
RewriteCond %{DOCUMENT_ROOT}/\$1 !-d
RewriteCond \$1 -ne\"api\"
RewriteRule ^/?(\w+)/?(\w*)?/?(\w*)?/?(\w*)?/?$ /accounts.php?account=\$1&project=\$2&track=\$3&recording=\$4 [PT]
" >> ${HTTPD_CONF}
printf "$DONE"

refresh_server ${ROOT_DIR}

refresh_client ${ROOT_DIR}

handle_error "$(sudo systemctl start mysqld 2>&1)"

refresh_database ${ROOT_DIR}

printf "${T}Setting proper file permissions..."
sudo chmod -R 764 ${ROOT_DIR}
# Remove executable permissions from files that shouldn't be executable
for file in $(find . -name '*.\*.sh$|\.*\.php$'); do
	sudo chmod -x $file
done
sudo chown -R ${1}:${1} ${ROOT_DIR}
printf "$DONE"
