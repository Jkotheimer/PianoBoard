#!/usr/bin/bash

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
ERROR="\r[${RED} ERROR ${NC}]"
T="\t"

printb() {
	printf "${BLUE}${1}${NC}\n"
}
print() {
	printf "${T} ${1}"
}
_done() {
	printf "${DONE}\n"
}
_error() {
	printf "${ERROR}\n${1}\n"
	exit -1
}
_warn() {
	printf "${WARNING} ${1}\n"
}

# -----------------------------------------------------------------------------
# MACROS
# -----------------------------------------------------------------------------

# Define a macro to get the docker id of the container named pianoboard
container='docker ps -aqf name=pianoboard'

# Define a macro to execute a command inside the docker container
drun() {
	docker exec -it $($container) "$@"
}

# Get the actual logged in user as the _USER variable
[ $SUDO_USER ] && _USER=$SUDO_USER || _USER=$(who am i | awk '{print $1}')

# Ensure we are in the project root directory (where this script lives)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd $ROOT

# -----------------------------------------------------------------------------
# GENERAL HELPER FUNCTIONS
# -----------------------------------------------------------------------------

# We need to note these variables because the symbols are locally allocated within function calls
script=$0
args=$@
elevate_privileges() {
	[ $EUID -eq 0 ] || {
		exec sudo "$script" "$args" && _warn "You must have root privileges to run this script"
	}
}
set_permissions() {
	print "Giving $_USER full permissions to this project directory"
	chown -R $_USER:$_USER $(pwd)
	_done
}
uncomment() {
	sed -i "/${1}/s/^#//g" ${2}
}
comment() {
	sed -i "/${1}/s/^/#/g" ${2}
}
get_service_name() {
	elevate_privileges
	_service=$(systemctl list-unit-files "*$1*" "*$2*" | grep enabled | awk '{print $1}' | head -n 1)
}
get_password() {
	pass=''
	conf_pass='-'
	while true; do
		read -s -p "Create a password for your mysql database: " pass
		echo ''
		read -s -p "Confirm your password: " conf_pass
		echo ''
		if [ $pass = $conf_pass ]; then
			break
		else
			_warn "Your passwords do not match. Try again."
		fi
	done
}
kill_services() {
	elevate_privileges

	# Remove any conflicting containers and boot up a new onw with the lamp stack
	[ $($container) ] && {
		print "Killing old container..."
		docker stop $($container) >/dev/null
		docker rm $($container) >/dev/null
		_done
	}
	
	# Kill any services running on the http and sql ports to avoid conflicts
	print "Killing all services running on ports 80, 3306, and 3306"
	fuser -k 80/tcp >/dev/null 2>&1
	fuser -k 3306/tcp >/dev/null 2>&1
	fuser -k 8081/tcp >/dev/null 2>&1
	kill $(pgrep node) 2>/dev/null
	get_service_name mysql mariadb
	[ $_service ] && {
		systemctl stop $_service
		systemctl disable $_service
	}
	get_service_name apache httpd
	[ $_service ] && {
		systemctl stop $_service
		systemctl disable $_service
	}
	_done
}
refresh_password() {
	set_passwords $(cat $ROOT/db.sh | cut -d"'" -f 2)
}
set_passwords() {

	print "Setting new password"
	# Change the mysql admin password internally
	drun mysql -uroot -e "ALTER USER admin IDENTIFIED BY '$1'" >/dev/null 2>&1
	
	# Create a script to manually connect to the database from the terminal
	echo "mysql -uadmin -p'$1' -h127.0.0.1" > db.sh
	chmod +x db.sh
	
	# Create a php script to connect to the database
	echo "<?php
	\$database = mysqli_connect('127.0.0.1', 'admin', '$1', 'pianoboard');
	if(\$database->connect_error) {
		die('Connection failed: ' . \$database->connect_error);
	} ?>" > $ROOT/client/resources/php/database.phpsecret

	# Create a js script to export the mysql username and password to the connector
	echo "module.exports = {mysql_username:'admin', mysql_password:'$1'}" > $ROOT/api/sql_config.jsecret
	_done
}
set_mysql_password() {
	elevate_privileges

	# Get a user password, set it to all relevant scripts, and restore project permissions
	get_password
	set_passwords $pass
	set_permissions

	unset pass conf_pass
}
refresh_pepper() {
	# Generate some secret pepper and add it to a php and js script for password hashing
	pepper=$(cat /tmp/* 2>&1 | md5sum | cut -d' ' -f1)
	echo "<?php \$pepper = \"$pepper\"; ?>" > $ROOT/client/resources/php/pepper.phpsecret
	echo "module.exports = '$pepper';" > $ROOT/api/auth/pepper.jsecret
}
refresh_database() {
	print "Refreshing database"
	./db.sh < sql/create_db.sql
	[ $? != 0 ] && _error "Something is wrong with your SQL connection or your db model"
	refresh_pepper
	_done
}
print_details() {
	echo ''
	echo "You're all set!"
	echo "Run ./db.sh to connect to your MySQL instance"
}
open_project() {
	sudo -u $_USER xdg-open http://localhost:80 >/dev/null 2>&1 &
}
display_help() {
	echo "--help     [-h] : Display this prompt"
	echo "--info     [-i] : Print useful details about the deployment of this project"
	echo "--reset    [-r] : Re-deploy a clean version of this project"
	echo "--start    [-s] : Start services"
	echo "--connect  [-c] : Connect to the docker container via the CLI"
	echo "--database [-d] : Clean the mysql database"
	echo "--password [-p] : Reset the mysql password for the container"
	echo "--apache   [-a] : Reconfigure apache and restart the server"
	echo "--node     [-n] : Refresh the node servlet"
	echo "--kill     [-k] : Kill the deployment of this project including any processes running on ports 80 & 3306"
	echo "_________________________________________________________________________________________"
}


# We use docker for the PHP web server because it is the most platform compatible option

# -----------------------------------------------------------------------------
# DOCKER SETUP FUNCTIONS
# -----------------------------------------------------------------------------

install_docker() {
	print "Installing docker"
	curl -sSL https://get.docker.com/ | sh >/dev/null 2>&1
	[ $? != 0 ] && _error "You must install Docker manually before deploying this script"

}
configure_docker() {
	elevate_privileges
	print "Configuring docker"
	# If the user isn't already in the docker group, add them to it
	[ "$(grep -E "docker.*$_USER" /etc/group)" = '' ] && usermod -aG docker $_USER >/dev/null 2>&1
	
	# Ensure docker is started and enabled
	systemctl enable docker --now >/dev/null 2>&1
	systemctl restart docker >/dev/null 2>&1
	_done
}
start_docker() {
	printb "Starting docker..."
	elevate_privileges

	mkdir -p logs
	print "Starting new container"
	systemctl start docker
	docker run -p 80:80 -p 3306:3306 -p 8081:8081 --name pianoboard -it -d -v $(pwd)/client:/app -v $(pwd)/api:/api -v $(pwd)/logs:/var/log/apache2 mattrayner/lamp:latest >/dev/null
	[ $? != 0 ] && _error
	_done

	# Wait 3 seconds for the container to boot up and prepare the services we need
	print "Waiting for services to start"
	sleep 3
	_done
}
docker_connect() {
	elevate_privileges
	docker exec -it $($container) bash
}

# -----------------------------------------------------------------------------
# DOCKER SERVICE FUNCTIONS
# -----------------------------------------------------------------------------
configure_apache() {
	elevate_privileges

	# Copy the script into the container then execute it
	print "Copying apache hook script into Docker container"
	docker cp $ROOT/scripts/apache_hook.sh $($container):/apache_hook.sh
	_done

	print "Running apache hook"
	drun /apache_hook.sh >/dev/null
	[ $? != 0 ] && _error "Fix your apache config in $(pwd)/scripts/apache_hook.sh"
	_done
}
configure_mysql() {
	
	# Use the container's nice lil function to start up mysql
	print "Initializing MySQL instance"
	drun /create_mysql_users.sh >/dev/null 
	sleep 1
	_done
	
	set_mysql_password
}

# -----------------------------------------------------------------------------
# NODE SETUP FUNCTIONS
# -----------------------------------------------------------------------------

start_node() {
	elevate_privileges

	# Copy the script into the container then execute it
	print "Copying node hook script into Docker container"
	docker cp $ROOT/scripts/node_hook.sh $($container):/node_hook.sh
	_done

	print "Running node hook"
	drun /node_hook.sh >/dev/null
	[ $? != 0 ] && _error
	_done

	print "Copying node startup script into Docker container"
	docker cp $ROOT/scripts/node_start.sh $($container):/node_start.sh
	_done

	print "Starting Node servlet"
	$(drun /node_start.sh >/dev/null 2>&1) &
	[ $? != 0 ] && _error
	_done
}

# -----------------------------------------------------------------------------
# FRESH INSTALLATION FLOW FUNCTION
# -----------------------------------------------------------------------------

fresh_install() {
	configure_docker
	kill_services
	start_docker
	configure_mysql
	refresh_database
	configure_apache
	start_node
	print_details
	open_project
	exit 0
}

# -----------------------------------------------------------------------------
# START ALL SERVICES
# -----------------------------------------------------------------------------

start_services() {
	kill_services
	start_docker
	start_node
	refresh_password
	refresh_database
}

# Install docker if it isn't already on the system
[ ! $(command -v docker) ] && {
	install_docker
	fresh_install
	exit 0
}

# If no database connector exists, start a fresh install
[ ! -f db.sh ] && {
	fresh_install
	exit 0
}

# If we've reached here and no flags are specified, display the help menu
[ -z $@ ] && {
	echo "You seem to have already deployed this project and you haven't specified any flags."
	display_help
	exit 1
}

# Each flag corresponds to a function call
declare -A commands=([--help]=display_help [-h]=display_help \
					[--info]=print_details [-i]=print_details \
					[--connect]=docker_connect [-c]=docker_connect \
					[--database]=refresh_database [-d]=refresh_database \
					[--kill]=kill_services [-k]=kill_services \
					[--password]=set_mysql_password [-p]=set_mysql_password \
					[--start]=start_services [-s]=start_services \
					[--reset]=fresh_install [-r]=fresh_install \
					[--apache]=configure_apache [-a]=configure_apache \
					[--node]=start_node [-n]=start_node)

# Iterate through the given arguments and create a list of executions
exe_list=()
for arg in "$@"; do   
	next=${commands[${arg}]}
	
	# If the argument isn't in the command list, throw an error
	[ -z "${next}" ] && {
		echo "Invalid argument: '${1}'"
		display_help
		exit -1
	}
	
	exe_list+=($next)
done

# Remove any duplicates
exe_list=($(echo "${exe_list[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '))

# Execute all the commands
for i in "${exe_list[@]}"; do $i; done
