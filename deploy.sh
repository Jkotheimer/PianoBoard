#!/usr/bin/bash

# If the user does not have elevated privileges, do that now
[ $EUID -eq 0 ] || exec sudo bash "$0" "$@"
[ $SUDO_USER ] && _USER=$SUDO_USER || _USER=$(who am i | awk '{print $1}')

# -----------------------------------------------------------------------------
# MACROS
# -----------------------------------------------------------------------------

# Define a macro to get the docker id of the container named pianoboard
container="docker ps -aqf name=pianoboard"

# Define a macro to execute a command inside the docker container
drun="docker exec -it $($container)"


# -----------------------------------------------------------------------------
# GENERAL HELPER FUNCTIONS
# -----------------------------------------------------------------------------

get_service_name() {
	_service=$(systemctl list-unit-files "*$1*" "*$2*" | grep enabled | awk '{print $1}' | head -n 1)
}
get_password() {
	pass=''
	conf_pass='-'
	while true; do
		read -s -p "Create a password for your mysql database: " pass
		echo ''
		read -s -p "Confirm your password: " conf_pass
		if [ $pass = $conf_pass ]; then
			break
		else
			echo "Your passwords do not match. Try again."
		fi
	done
	echo ''
}
kill_services() {
	# Kill any services running on the http and sql ports to avoid conflicts
	fuser -k 80/tcp
	fuser -k 3306/tcp
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
}
set_mysql_password() {
	# Get and set a new password for mysql
	get_password
	
	# Change the mysql admin password internally
	$drun mysql -uroot -e "ALTER USER 'admin' IDENTIFIED BY '$pass';"
	
	echo "mysql -uadmin -p'$pass' -h127.0.0.1" > db.sh
	chmod +x db.sh
	
	unset pass conf_pass
}

# We use docker for the PHP web server because it is the most platform compatible option

# -----------------------------------------------------------------------------
# DOCKER SETUP FUNCTIONS
# -----------------------------------------------------------------------------

install_docker() {
	curl -sSL https://get.docker.com/ | sh
	[ $? != 0 ] && {
		echo "You must install Docker manually before deploying this script"
		exit 1
	}

}
configure_docker() {
	# If the user isn't already in the docker group, add them to it
	[ "$(grep -E "docker.*$_USER" /etc/group)" = '' ] && usermod -aG docker $_USER
	
	# Ensure docker is started and enabled
	systemctl enable docker --now
	systemctl restart docker
}
start_docker() {
	# Remove any conflicting containers and boot up a new onw with the lamp stack
	[ $($container) ] && {
		echo "Killing old container..."
		docker stop $($container)
		docker rm $($container)
	}
	mkdir -p logs
	echo "Starting new container..."
	docker run -p 80:80 -p 3306:3306 --name pianoboard -it -d -v $(pwd)/client:/app -v $(pwd)/logs:/var/log/apache2 mattrayner/lamp:latest
	
	# Reinstantiate the drun macro because our container now has a new hash
	drun="docker exec -it $($container)"
	
	# Wait 3 seconds for the container to boot up and prepare the services we need
	echo "Waiting for services to start..."
	sleep 3
	
	# Use the container's nice lil function to start up mysql
	echo "Initializing MySQL database..."
	$drun /create_mysql_users.sh > temp.txt
	cat temp.txt
	
	# Grab the login line (which contains a new password) from the last command output and make a script for it
	grep "mysql -uadmin" temp.txt | sed "s/<host>/127.0.0.1/g; s/<port>/3306/g; s/  //g;" | tr -d '\r' > db.sh
	chmod +x db.sh

	rm temp.txt
}

# Install docker if it isn't already on the system
command -v docker > /dev/null
[ $? != 0 ] && install_docker

configure_docker
kill_services
start_docker
set_mysql_password

echo ''
echo "You're all set!"
echo "Run ./db.sh to connect to your MySQL instance"

chown -R $_USER:$_USER $(pwd)

sudo -u $_USER xdg-open http://localhost:80 >/dev/null 2>/dev/null &
