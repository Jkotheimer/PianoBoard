#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# GENERAL HELPER FUNCTIONS
# -----------------------------------------------------------------------------
display_help() {
	echoc "-----------------------------------------------------------------------" $BLUE
	echoc "|                      HOW TO USE THIS SCRIPT                         |" $BLUE
	echoc "-----------------------------------------------------------------------" $BLUE
	echo "--help         [-h] : Display this prompt"
	echo "--dev          [-d] : Deploy a local development server"
	echo "--db-connect   [-c] : Connect to the database (requires a 'scripts/sql/db_config.secret' file)"
	echo "--db-reset     [-r] : Reset the database, clearing all entries and rebuilding from 'scripts/sql/create_db.sql'"
	echo "--db-password  [-p] : Refresh the database password. A random string is generated and autofilled in all necessary places"
	echoc "_______________________________________________________________________" $BLUE
}

uncomment() {
	sed -i "/${1}/s/^#//g" ${2}
}
comment() {
	sed -i "/${1}/s/^/#/g" ${2}
}
kill_services() {
	elevate_privileges

	# Kill any services running on the http and sql ports to avoid conflicts
	_print "Killing all services running on ports 80, 3306, and 3306"
	fuser -k 80/tcp >/dev/null 2>&1
	fuser -k 3306/tcp >/dev/null 2>&1
	fuser -k 8081/tcp >/dev/null 2>&1
	kill $(pgrep node) 2>/dev/null
	_done
}
open_project() {
	xdg-open $PB_HOST >/dev/null 2>&1 &
}
# -----------------------------------------------------------------------------
# DEPENDENCY CHECKING & DOWNLOADING
# -----------------------------------------------------------------------------
check_dependencies() {
	dependencies=(openssl php mysql make)
	err=()
	for i in ${dependencies[@]}; do
		[ $(command -v $i) ] || err+=($i)
	done
	[ ${#err[@]} -eq 0 ] || _error "You must install the following packages in order to deploy this project:\n${err[*]}" - -

	# Download missing dependencies
	[ ! -d .dependencies ] && {
		mkdir -p $ROOT/.dependencies
		install_dependency httpd --enable-so
	}
}
get_apache_mirror() {
	_print 'Fetching your mirror'
	curl -o ./mirrors.txt http://ws.apache.org/mirrors.cgi > /dev/null 2>&1
	MIRROR=$(grep -E '<p><a href=.*</strong></a>' mirrors.txt | cut -d '"' -f 2)
	rm mirrors.txt
	_done
}
# $1: name of dependency
# $2: config options
install_dependency() {
	
	# Get an apache mirror if not already
	[ -z "$MIRROR" ] && get_apache_mirror
	
	# Get the name of the most recent version of the specified dependency
	FILE_NAME="$(curl $MIRROR$1/ 2>/dev/null | grep "\"$1-.*.tar.gz\"" | cut -d '"' -f 6)"

	_print "Downloading $1"
	# If The file hasn't been downloaded yet, download it and store it temporarily
	[ ! -f /tmp/$FILE_NAME ] && {
		curl -o /tmp/$FILE_NAME "$MIRROR$1/$FILE_NAME" >/dev/null 2>&1
		[ $? -eq 0 ] || _error "Failed to download dependency: $1"
	}
	_done

	_print "Extracting $1"
	# Extract the source into the dependencies 
	tar -xvzf /tmp/$FILE_NAME -C $ROOT/.dependencies >/dev/null 2>&1
	_done

	_print "Installing $1"
	# This will be the build directory
	mkdir -p $ROOT/.dependencies/$1

	# Move into the source directory, configure, build, & install locally
	cd $ROOT/.dependencies/$1-*
	./configure --prefix=$ROOT/.dependencies/$1 $2 >/dev/null 2<&1
	make >/dev/null 2>&1
	make install >/dev/null 2>&1

	# Move back into the root directory and remove the source folder,
	# leaving a successfully installed build directory
	cd $ROOT
	rm -r $ROOT/.dependencies/$1-*
	_done
}

# -----------------------------------------------------------------------------
# DB, AUTH, & SECURITY FUNCTIONS
# -----------------------------------------------------------------------------
get_db_credentials() {
	[ ! -f scripts/sql/db_config.secret ] && _error "You do not have the required credentials to connect to your database :/ see README about how to create this."
	. scripts/sql/db_config.secret
	[[ -z "$DB_USER" || -z "$DB_PASSWORD" || -z "$DB_HOST" || -z "$DB_PORT" || -z "$DB_NAME" ]] && _error "Invalid db_config.secret file. Review README, reconfigure, and try again" - -
}
unset_db_credentials() {
	unset DB_USER DB_PASSWORD DB_HOST DB_PORT DB_NAME >/dev/null 2>&1
}
reset_db_password() {

	_print "Generating new 64 character password"
	NEW_PASSWORD="$(openssl rand -hex 64)"
	_done

	_print "Setting new password"
	# Change the mysql admin password internally
	get_db_credentials
	mysql -u$DB_USER -p$DB_PASSWORD -h $DB_HOST -P $DB_PORT -e "ALTER USER $DB_USER IDENTIFIED BY '$NEW_PASSWORD'" >/dev/null 2>&1
	
	# Create a php script to connect to the database
	echo "<?php
	\$database = mysqli_connect('$DB_HOST', '$DB_USER', '$NEW_PASSWORD', '$DB_NAME');
	if(\$database->connect_error) {
		die('Connection failed: ' . \$database->connect_error);
	} ?>" > client/resources/php/database.phpsecret

	# Create a js script to export the mysql username and password to the connector
	echo "module.exports = {db_user:'$DB_USER', db_password:'$NEW_PASSWORD', db_host:'$DB_HOST', db_port:'$DB_PORT', db_name:'$DB_NAME'}" > api/db_config.jsecret

	# Change the password in the actual config file
	sed -i "s/DB_PASSWORD.*/DB_PASSWORD='$NEW_PASSWORD'/g" scripts/sql/db_config.secret
	unset_db_credentials
	unset NEW_PASSWORD

	_done
}
pb_db_reset() {
	print "Refreshing database"
	pb_db_connect < scripts/sql/create_db.sql
	[ $? != 0 ] && _error "Something is wrong with your SQL connection or your db model"
	 # The database has been reset, might as well refresh the pepper while we're clean!
	refresh_pepper
	_done
}
pb_db_connect() {
	get_db_credentials
	mysql -u$DB_USER -p"$DB_PASSWORD" -h $DB_HOST -P $DB_PORT $DB_NAME
	unset_db_credentials
}
refresh_pepper() {
	# Generate some secret pepper and add it to a php and js script for password hashing
	pepper=$(openssl rand -base64 64)
	echo "<?php \$pepper = \"$pepper\"; ?>" > client/resources/php/pepper.phpsecret
	echo "module.exports = '$pepper';" > api/auth/pepper.jsecret
}

# -----------------------------------------------------------------------------
# COLORS
# -----------------------------------------------------------------------------
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m"
DONE="\r[${GREEN} DONE ${NC}]"
WARNING="\r[${YELLOW} WARN ${NC}]"
ERROR="\r[${RED} FAIL ${NC}]"
T="        "

# -----------------------------------------------------------------------------
# PRETTY PRINTING FUNCTIONS
# -----------------------------------------------------------------------------
echoc() {
	printf "${2}${1}${NC}\n"
}
_print() {
	printf "${T} ${1}"
}
_done() {
	printf "${DONE}\n"
}
_error() {
	printf "${ERROR}"
	[ -z "$2" ] && printf "\n$1" && exit 1
	printf " $1\n"
	[ -n "$3" ] && exit 1
}
_warn() {
	printf "${WARNING} ${1}\n"
}

. scripts/pianoboard.cfg
[ -z "$ROOT" ] && _error 'Pianoboard config not found. Please use ./run.sh' - -
