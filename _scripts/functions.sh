#!/usr/bin/env bash
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m"
DONE="\r[${GREEN}DONE${NC}]\n"
WARNING="\r[${YELLOW}WARNING${NC}] "
ERROR="\r[${RED}ERROR${NC}] "
T="\t"

handle_error() {
	if [ ! $? -eq 0 ]; then
		printf "${ERROR}${1}"
		printf "                                                                                           \n"
		exit -1
	fi
}

exists() {
	if [ $(command -v ${1}) ]; then
		echo 1
	fi
}

# ${1} : name of file to download
# ${2} : url from which to download
download_dependency() {
	printf "${T}Downloading ${1}..."
	if [ ! -f /tmp/${1}.tar.gz ]; then
		handle_error "$(curl -o /tmp/${1}.tar.gz ${2} 2>&1)"
	fi
	printf ${DONE}
}

# ${1} : name of file to extract
# ${2} : directory to extract to
extract_dependency() {
	printf "${T}Extracting ${1}..."
	mkdir ${2}/${1}
	handle_error "$(tar -xvzf /tmp/${1}.tar.gz -C ${2} 2>&1 > /dev/null)"
	printf ${DONE}
}

# ${1} : directory of source to be installed
# ${2} : configuration options
# ${3} : post installation script
install_dependency() {
	printf "${T}Installing ${1##*/}..."
	cd ${1}
	handle_error "$(./configure ${2} 2>&1 > /dev/null)"
	handle_error "$(make 2>&1 > /dev/null)"
	handle_error "$(make install 2>&1 > /dev/null)"
	${3}
	rm -r ${1}
	printf ${DONE}
}

# ${1} Line identifier
# ${2} File name
uncomment() {
	sed -i "/${1}/s/^#//g" ${2}
}

# ${1} Process to find port for
# search through netstat for the process, then isolate the port number and return it
get_port() {
	PORT=$(sudo netstat -tulpn | grep ${1} | awk -F' :::' '{print $2}')
	if [ -z ${PORT} ]; then
		PORT=$(sudo netstat -tulpn | grep ${1} | awk -F':' '{print $2}' | awk '{print $1}')
	fi
	echo $PORT
}

# ${1} : ROOT_DIR
refresh_database() {
	
	if [ -d ${1} ]; then
		cd ${1}
	fi
	if [ ! -d ./_client ]; then
		printf "${ERROR}Move to project root directory and try again\n"
	fi
	
	read -t 60 -p "Enter MySQL username (default is 'root'): " USERNAME
	if [ -z ${USERNAME} ]; then
		USERNAME="root"
	fi
	read -t 60 -s -p "Enter password for '${USERNAME}'@'localhost' (default is ''): " PASSWORD
	echo ""
	printf "${T}Creating Pianoboard database..."
	if [ -z ${PASSWORD} ]; then
		handle_error "$(mysql -u${USERNAME} < ${1}/_server/sql/create_db.sql 2>&1)"
	else
		handle_error "$(mysql -u${USERNAME} -p"${PASSWORD}" < ${1}/_server/sql/create_db.sql 2>&1)"
	fi
	printf ${DONE}
	
	printf "${BLUE}MySQL database running on port $(get_port mysql)${NC}\n"
	
	printf "${T}Writing PHP script to connect to MySQL..."
	rm ./_client/resources/php/database.phpsecret 
	touch ./_client/resources/php/database.phpsecret
	echo "<?
	\$database = mysqli_connect('127.0.0.1', '${USERNAME}', '${PASSWORD}', 'Pianoboard');
	if(\$database->connect_error) {
		die('Connection failed: ' . \$conn->connect_error);
	}
?>
	" >> ${1}/_client/resources/php/database.phpsecret
	rm ./_client/resources/php/pepper.phpsecret 
	touch ./_client/resources/php/pepper.phpsecret
	echo "<?\$pepper = \"$(cat /tmp/* 2>&1 | md5sum | cut -d' ' -f1)\";?>" >> ${1}/_client/resources/php/pepper.phpsecret
	printf ${DONE}
	
	printf "${T}Generating config file..."
	rm run.cfg 2> /dev/null
	echo "ROOT_DIR='${1}'
DB_USERNAME='${USERNAME}'
DB_PASS='${PASSWORD}'" > run.cfg
	chmod 777 run.cfg
	PASSWORD="NULL"
	printf ${DONE}
}

# ${1} : ROOT_DIR
refresh_server() {
	sudo fuser -k 80/tcp > /dev/null 2>&1
	sudo ${1}/_dependencies/httpd/bin/apachectl start
}

# ${1} : ROOT_DIR
refresh_client() {
	rm -rf ${1}/_dependencies/httpd/htdocs/*
	ln -s ${1}/_client/* ${1}/_dependencies/httpd/htdocs/
}

refresh_all() {
	refresh_server ${1}
	refresh_client ${1}
	refresh_database ${1}
	exit 0
}

test_db() {
	exec_sql ${1} ${2}  ${3}/_server/sql/test/test_insertions.sql
}

clear_db() {
	exec_sql ${1} ${2} ${3}/_server/sql/create_db.sql
}

exec_sql() {
	mysql -u${1} -p${2} < ${3}
}
