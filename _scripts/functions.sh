#!/usr/bin/env bash
GREEN="\033[0;32m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m"
DONE="\r[${GREEN}DONE${NC}]\n"
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
}

# ${1} : Optional project root directory
create_database() {
	
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
		handle_error "$(mysql -u${USERNAME} < ./_server/sql/create_db.sql 2>&1)"
		printf "Database created with no credentials\n"
	else
		handle_error "$(mysql -u${USERNAME} -p"${PASSWORD}" < ./_server/sql/create_db.sql 2>&1)"
	fi
	printf ${DONE}
	
	printf "${T}Writing PHP script to connect to MySQL..."
	rm ./_client/resources/php/database.phpsecret 2> /dev/null
	touch ./_client/resources/php/database.phpsecret
	echo "<?
	\$database = mysqli_connect('127.0.0.1', '${USERNAME}', '${PASSWORD}', 'Pianoboard');
	if(\$database->connect_error) {
		die('Connection failed: ' . \$conn->connect_error);
	}
	?>
	" >> ${CLIENT_DIR}/resources/php/database.phpsecret
	PASSWORD="NULL"
	printf ${DONE}
}
