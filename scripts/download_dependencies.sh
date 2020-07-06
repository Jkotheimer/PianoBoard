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
	printf "\n${ERROR} Please install mysql before installing this package\n"
	rm -rf ${DEP_DIR}
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
	"--prefix=${DEP_DIR}/php/ --with-apxs2=${HTTPD_HOME}/bin/apxs --with-mysqli --with-curl" \
	$(cp php.ini-development /usr/local/lib/php.ini 2> /dev/null; cd ${ROOT_DIR})

config_httpd ${ROOT_DIR}

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
