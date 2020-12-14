#!/usr/bin/env bash
# run.sh
# 
# @author: Jack Kotheimer
# @date: 12/5/2020
#
# The main functionality of the script is listed just below in the '_help' function, but if you have any questions about
# the functionality or implementation of this script, feel free to send me a message via email at jkotheimer9@gmail.com
#
# Enjoy!
###############################################################################

if [ $EUID -eq 0 ]; then
	_warn 'Hold your horses! You are running this script as root, meaning other users will not be able to access many of the generated server resources.'
	read -r -n 1 -p 'Are you sure you wish to continue? [y/N] ' choice
	echo
	[[ ${choice^^} != 'Y' ]] && exit 1
fi
mkdir -p logs/

# DEFAULT VARIABLES & ENABLERS
VERBOSE=0
_verbose() {
	echoc 'Verbose output enabled' "$yellow"
	VERBOSE=1
}
WSL=0 # Windows Subsystem for Linux has a few different setup conditions
[ -d /mnt/c/Program\ Files ] && {
	echoc 'WSL detected' "$yellow"
	WSL=1
	alias docker=docker.exe
}

# -----------------------------------------------------------------------------
# PRETTY PRINTERS/ COMMAND HANDLER
# -----------------------------------------------------------------------------
# Just some colorful output handlers to satisfy those who enjoy clean script responses
red=$'\033[0;31m'
yellow=$'\033[0;33m'
green=$'\033[0;32m'
blue=$'\033[0;34m'
nc=$'\033[0m'

# Print something in color
# $1: String to print
# $2: Color to print with
echoc() {
	printf "%s%s%s\n" "$2" "$1" "$nc"
}
# Print the description of a command before its execution
_print() {
	[ "$VERBOSE" -eq 1 ] && printf "%s...\n" "$@" || printf '[ .... ] %s' "$@"
}
_ok() {
	printf "\r[%s DONE %s]\n" "$green" "$nc"
}
_warn() {
	printf "\r[%s WARN %s] %s\n" "$yellow" "$nc" "$1"
}
# $1: Error message
# $2: (optional) '-' to print the error message inline with the [ FAIL ] flag
_err() {
	printf "\r[%s FAIL %s] " "$red" "$nc"
	[ -z "$2" ] && printf "\n"
	printf "%s\n" "$1"
	exit 1
}
# $1: Command to execute and handle
# $2: (optional) log file to save command output to
# $3: (optional) '-' to put an '&' after command to make it a background process
_handle() {
	# If a log file was specified, set it to the output variable
	LOG=logs/temp.log
	[ -n "$2" ] && LOG=logs/$2 
	STAT=0
	# If the daemon flag is set, send the command to the daemons
	if [ -n "$3" ]; then
		if [ "$VERBOSE" -eq 1 ]; then
			$1 | tee "$LOG" &
			STAT=${PIPESTATUS[0]}

			# If the daemon flag was a '/' under verbose mode, wait for the command to resolve
			# This is typically done if the command is the last command in a series, and you want to view it's output
			if [ "$3" = '/' ]; then
				wait
			else
				sleep 3
			fi
		else
			$1 &>"$LOG" &
			STAT=$?
			sleep 3
		fi
	else
		if [ "$VERBOSE" -eq 1 ]; then
			$1 | tee "$LOG"
			STAT=${PIPESTATUS[0]}
		else
			$1 &>"$LOG"
			STAT=$?
		fi
	fi

	# If the status was successful, print [ DONE ], else exit with the status code of the command
	if [ "$STAT" -eq 0 ]; then
		_ok
		[[ "$VERBOSE" -ne 1 && -n "$2" ]] && echoc "Log: $LOG" "$blue"
	else 
		if [ "$VERBOSE" -eq 1 ]; then
			_err "Status: $STAT" -
		else
			_err "$(tail -n 15 "$LOG")"
		fi
	fi
	return "$STAT"
}
_help() {
	# figlet is used to make bubble letters!
	FIG=0
	command -v figlet &>/dev/null && FIG=1 || echo Install figlet for bubble letters on your app name!
	
	echoc '-------------------------------------------------------------------' "$blue"
	printf '%s' "$blue"
	[ "$FIG" -eq 1 ] && figlet "$APP" || echo "$APP"
	echoc '-------------------------------------------------------------------' "$blue"
	echo 
	echo 'This script contains several functions to automate the software development process'
	echo 'Only one function may be executed at a time'
	echo 
	echo 'If you wish to add an operation to this script, contain it to a single function and add it to the'
	echo 'case statement at the bottom of this file. Document the function it serves in this help menu, and'
	echo 'create a pull request :)'
	echo 
	echoc '-----------------------------------------------' "$blue"
	echoc '|           HOW TO USE THIS SCRIPT            |' "$blue"
	echoc '-----------------------------------------------' "$blue"
	echoc './run.sh <primary> <secondary>' "$yellow"
	echo  '   <primary>   : (required) is any one of the below commands (a secondary command may be used as a primary)'
	echo  '   <secondary> : (optional) is any combination of secondary commands'
	echo 
	echoc 'PRIMARY COMMANDS' "$blue"
	echoc '-------------------------------------------------------------------' "$blue"
	echo 'Only one of these may be used at a time. It must be the first argument'
	echoc '-------------------------------------------------------------------' "$blue"
	echo '--deploy      [-d]: Deploy the server'
	echo '    Dependencies from config/app.conf'
	echo '        - ENV: Environment to deploy to (dev, staging, production). See --env'
	echo '        - TAG: Docker image tag to deploy with. See --tag'
	echo '--boot        [-b]: Reboot the container without starting the server.'
	echo 
	echoc 'SECONDARY COMMANDS' "$blue"
	echoc '-------------------------------------------------------------------' "$blue"
	echo 'Any number of these commands can be used in one call of this script in any order'
	echo 'xxx-primary: When a secondary command is used as an \<option\>, it either resolves before \(pre\) or after \(post\) the primary command'
	echoc '-------------------------------------------------------------------' "$blue"
	echoc 'Pre-primary -------------------------------------------------------' "$yellow"
	echo '--verbose     [-v]: Display verbose output on the primary function'
	echo '--kill        [-k]: Kill the docker container'
	echo '--pull        [-p]: Pull an image from Docker Hub'
	echo '--rebuild     [-r]: Build a new Docker image'
	echo '--config      [-f]: Regenerate config/app.conf before doing anything'
	echo '--env         [-e]: Switch environments to work in'
	echo '    <env> : dev, staging, or production'
	echo '--tag         [-t]: Checkout a new tag name for your image'
	echo '    <tag> : Any string as a tag name OR'
	echo '            "git" to use your git branch name as a tag OR'
	echo '            "-" to copy your current tag onto the "latest" tag'
	echo 
	echoc 'Post-primary ------------------------------------------------------' "$yellow"
	echo '--dockershell [-l]: Enter the development docker container command line'
	echo '--db-connect  [-c]: Connect to a database'
	echo '--clean       [-n]: Clean all dangling docker images'
	echo '--push        [-u]: Push a recently built image to Docker Hub'
	echo '--help        [-h]: Show this help menu'
	echo 
	echoc '*If no arguments are supplied, this help menu is displayed' "$yellow"
	echo 
}

###############################################################################
# AUTOMATION FUNCTIONS START HERE
###############################################################################
# -----------------------------------------------------------------------------
# SOFTWARE REQUIREMENT CHECKING
# -----------------------------------------------------------------------------
# Ensure all manchine-specific programs are installed before attempting to set up the server
# Pass any basic commands that are required for something
req_check() {
	# Absolute requirements + any requirements passed via arguments
	err=()
	for cmd in "$@"; do
		command -v "$cmd" &>/dev/null || err+=("$cmd")
	done
	[ ${#err[@]} -gt 0 ] && _err "You must install the following package(s) in order to deploy this project: ${err[*]}" -

	[ ! -f .env ] && gen_dotenv
	if [ ! -f config/app.conf ]; then
		_warn 'config/app.conf not found. You will be prompted for info on your application'
		gen_app_conf
	fi
}
# These requirements are remote deployment specific. I added handlers for them just for ease of use
remote_req_check() {
	[ -f config/staging.secret ] || _err "Required file not found: config/staging.secret" -
	command -v eb &>/dev/null || {
		_warn 'You must install AWS eb cli before running any remote deployment'
		read -r -n 1 -p 'Would you like to install now? [Y/n]: ' choice
		[[ -z "$choice" || "${choice^^}" = 'Y' ]] && pip3 install awsebcli --upgrade --user || exit 1
	}
	[ -d .elasticbeanstalk/ ] || {
		_warn 'You have not initialized ElasticBeanstalk'
		read -r -n 1 -p 'Would you like to do that now? [Y/n]: ' choice
		[[ -z "$choice" || "${choice^^}" = 'Y' ]] && eb init || exit 1
		set_remote_env
	}
	EB_LIST="$(eb list)"
	[ -z "$EB_LIST" ] && {
		_warn 'You do not have any EB environments set up.'
		read -r -n 1 -p 'Would you like to create one now? [Y/n]: ' choice
		[[ -z "$choice" || "${choice^^}" = 'Y' ]] && eb create || exit 1
	}
}
# -----------------------------------------------------------------------------
# SHORTCUTS
# -----------------------------------------------------------------------------
ELEV=0
elevate_privileges() {
	[ "$ELEV" -eq 0 ] && _warn 'Gaining root privileges'
	# This stalls the terminal before doing a sudo task in case if a password is required
	sudo chown -R "$USER":"$USER" "$(pwd)" &>/dev/null && ELEV=1
}
# Update a variable setting in any given config file
# $1: Variable name
# $2: Variable value
# $3: (optional) config file name - default=config/app.conf
update_conf() {
	[ -z "$3" ] && conf=config/app.conf || conf=$3
	if grep "$1='" "$conf" &>/dev/null; then
		sed -i "s|$1='.*|$1='$2'|g" "$conf"
	else
		echo "$1='$2'" >> "$conf"
	fi
}
gen_dotenv() {
	update_conf DB_PASSWORD "$(openssl rand -hex 32)" .env
}
gen_app_conf() {
	read -r -p 'Name of your organization: ' ORG
	read -r -p 'Name of your application: ' APP
	echo "#!/usr/bin/env bash
ORG=$ORG
APP=$APP
ENV=dev
TAG=latest" > config/app.conf
	gen_docker_conf
	source config/app.conf
}
# This function adds volume and port info from the Dockerfile as 'docker run' parameters to config/app.conf for continuous use
gen_docker_conf() {
	
	DOCKER_RUN_PARAMETERS=''

	# Add any ports specified by EXPOSE in the Dockerfile
	while IFS= read -r p; do
		DOCKER_RUN_PARAMETERS+="-p $p:$p "
	done < <(grep -oP '(?<=EXPOSE ).*?(?=/)' < Dockerfile)

	# Add any symlinked volumes specified by COPY in the Dockerfile
	local_v=''
	while IFS= read -r line; do
		for val in $line; do
			if [ "$val" = COPY ]; then
				unset local_v
			elif [ -z "$local_v" ]; then
				# If the local volume starts with a '.', replace it with $(pwd)
				if [[ "$val" =~ ^\. ]]; then
					[ ! -d $val ] && mkdir $val
					val="$(pwd)${val:1}"
				fi
				local_v="$val"
			else
				DOCKER_RUN_PARAMETERS+="-v $local_v:$val "
			fi
		done
	done < <(grep COPY Dockerfile)

	# Add the DOCKER_RUN_PARAMETERS config to the config/app.conf
	update_conf DOCKER_RUN_PARAMETERS "$DOCKER_RUN_PARAMETERS"
}

# -----------------------------------------------------------------------------
# DOCKER MACROS & HELPERS
# -----------------------------------------------------------------------------

# Ensure installation and configuration of docker and make sure the docker service is started
start_docker() {
	# If you don't have docker, we try to auto install it
	if ! command -v docker &>/dev/null; then
		[ "$WSL" -eq 1 ] && _err 'You must have Docker for Windows installed as docker.exe'
		_print 'Installing docker'
		_handle 'curl -sSL https://get.docker.com/ | sh' docker-install.log
	fi

	# If we are working in WSL, make a symlink between Windows docker and the subsystem's docker
	if [[ "$WSL" -eq 1 && ! $(command -v docker.exe) ]]; then
		elevate_privileges
		_print 'Linking Windows Docker with WSL Docker'
		_handle 'sudo ln -sf /mnt/c/Program\ Files/Docker/Docker/resources/docker.exe /usr/bin/'
	fi
	
	# If the user isn't already in the docker group, add them to it
	if ! grep -E "docker.*$USER" /etc/group &>/dev/null; then
		elevate_privileges
		_print "Adding $USER to the docker group"
		_handle "sudo usermod -aG docker $USER"
	fi

	# If the docker service is not running (if the status funtion failed), start it
	if [[ $WSL -ne 1 && $(! pgrep docker &>/dev/null) ]]; then
		elevate_privileges
		_print 'Starting Docker service'
		_handle 'sudo dockerd' docker-service.log -
		_warn 'dockerd was used to start the docker service. This is known to be buggy. It is recommended that you start the docker daemon manually.'
	fi
}

# Macro to execute a command inside the docker container
# $@: Any valid bash command
drun() {
	docker exec -it "$APP" "$@" || _err
}
kill_docker_container() {
	_print 'Killing Docker container'
	docker kill "$APP" &>/dev/null
	_ok
}
remove_docker_container() {
	kill_docker_container
	_print 'Removing Docker container named ezclinic'
	docker rm "$APP" &>/dev/null
	_ok
}
remove_docker_image() {
	remove_docker_container
	_print "Removing Docker image named $ORG/${APP}_$ENV:$TAG"
	docker image rm "$(docker image ls -aq "$ORG/${APP}_$ENV:$TAG")" &>/dev/null
	_ok
}
docker_login() {
	_print 'Logging you into Docker'
	_handle 'docker login'
}
pull_docker_image() {
	docker_login

	_print "Pulling from docker.io/$ORG/${APP}_$ENV:$TAG"
	_handle "docker pull $ORG/${APP}_$ENV:$TAG"
}
push_docker_image() {
	docker_login

	# If the second flag is set, make the latest tag reference the image of the last tag
	[[ -n "$2" && "$TAG" != latest ]] && {
		_warn "Overwriting latest tag with $TAG"
		docker image tag "$ORG/${APP}_$ENV:$TAG" "$ORG/${APP}_$ENV:latest"
		TAG=latest
	}

	_print "Pushing new docker image to docker.io/$ORG/${APP}_$ENV:$TAG"
	_handle "docker push $ORG/${APP}_$ENV:$TAG"
}
create_docker_image() {
	[ "$VERBOSE" -ne 1 ] && echoc 'Verbose output auto-enabled' "$yellow"
	VERBOSE=1
	_print "Building Docker image: $ORG/${APP}_$ENV:$TAG (this may take a hot sec)"
	_handle "docker build --tag $ORG/${APP}_$ENV:$TAG --target $ENV ." docker-init.log
}
create_docker_container() {
	remove_docker_container
	gen_docker_conf
	_print "Creating Docker container named $APP with image: $ORG/${APP}_$ENV:$TAG"
	_handle "docker run -d $DOCKER_RUN_PARAMETERS --hostname com-$APP-app --name $APP -it $ORG/${APP}_$ENV:$TAG" docker-run.log
}
start_docker_container() {
	kill_docker_container
	_print "Starting existing Docker container named $APP"
	_handle "docker container start $APP"
}
clean_docker_images() {
	_print 'Cleaning dangling images'
	_handle "docker image rm -f $(docker image ls -aqf dangling=true)"
}
# Docker Container/Image Status
# @returns
#   0: No image, no container
#   1: Image exists, but no container
#   2: Image & container exist, but container not running
#   3: Image & container exist, container is alive, but not running properly
#   4: Image & container exist, container is alive & running properly
docker_ci_status() {
	STAT=0
	echoc "Checking for image named $ORG/${APP}_$ENV:$TAG" "$blue"
	if docker image ls | grep "$ORG/${APP}_$ENV.*$TAG"; then
		((STAT++))
	else
		return $STAT
	fi

	echoc "Checking for container named $APP" "$blue"
	if docker ps -a | grep "$APP"; then
		((STAT++))
	else
		return $STAT
	fi

	echoc "Checking status of container" "$blue"
	if docker ps | grep "$APP"; then
		((STAT++))
	else
		return $STAT
	fi
	docker ps | grep "Up.*$APP" && ((STAT++))

	return $STAT
}

# -----------------------------------------------------------------------------
# SERVER STARTUP FUNCTION
# The goal of this function is to boot up a Docker container with the server (and all it's microservices) in one fell swoop.
# -----------------------------------------------------------------------------
_deploy() {

	# Make sure the Docker daemon is running
	start_docker

	# Get the status of the project in terms of its Docker image and container
	docker_ci_status
	case $? in
		0)
			# No image/container - create image
			create_docker_image;;
		1)
			# Image but no container - create container
			create_docker_container;;
		2)
			# Image & dead container - start the dead container
			start_docker_container;;
		3)
			# Image & faulty container - kill & restart container
			remove_docker_container
			create_docker_container;;
	esac

	# Execute the deploy script regardless
	drun /var/www/config/deploy.sh
}

# -----------------------------------------------------------------------------
# REMOTE DEPLOYMENT MECHANISMS
# -----------------------------------------------------------------------------
set_remote_env() {
	_print 'Setting environment variables'
	# Grab the secret files, use xargs to turn into arguments
	_handle "eb setenv $(cat config/staging.env config/staging.secret .env | xargs)" eb-setenv-localreport.log
	# Allow time for AWS to return to the 'ready' state
	sleep 3
}
deploy_staging_environment() {

	# Add explicit delimiters to the args
	args=$(echo "/$*/" | tr ' ' /)

	# If an environment is selected (it has a * in front of it), just use it. If not, prompt fo
	eb_environment="$(echo "$EB_LIST" | grep '\*' | sed 's/* //g')"
	[ -z "$eb_environment" ] && {
		echoc 'Which EB Instance would you like to Use?' "$blue"
		echoc "$EB_LIST" "$yellow"
	
		# Prompt for environment selection until valid selection
		while true; do
			read -r -p "Type one of the above env names: " eb_environment
			if eb use "$eb_environment" &>/dev/null; then
				break
			else
				_warn 'Invalid environment name'
			fi
		done
	}

	# Check for optional flags
	[[ "$args" == */--update/* || "$args" == */-u/* ]] && set_remote_env
	[[ "$args" == */--migrate/* || "$args" == */-m/* ]] && make_db_migrations

	_print "Deploying application in $eb_environment (This may take a while)"
	_handle 'eb deploy --staged' eb-deploy-localreport.log
	eb open 
}

# -----------------------------------------------------------------------------
# FLAG SETTING & FUNCTION EXECUTION
# -----------------------------------------------------------------------------
req_check docker perl
source config/app.conf
if [ "$TAG" = git ]; then
	TAG="$(git branch | grep '\* ' | sed 's/* //g')"
elif [ -z "$TAG" ]; then
	TAG=latest
fi

# This function "converts" an argument tag (like --verbose or -v) into a function name
# @param: $1 an argument tag
# @returns: 0, 1, 2, 3, or 4
#   0: pre-primary (no follow-up value)
#   1: pre-primary (with follow-up value. e.g.: --tag <tagname>. (<tagname> is the follow-up value))
#   2: primary
#   3: post-primary (no follow-up value)
#   4: post-primary (with follow-up value)
parse_cmd() {
	case $1 in
		# PRIMARY COMMANDS
		--deploy | -d)
			echo _deploy
			return 2;;
		--boot | -b)
			echo create_docker_container
			return 2;;
		# SECONDARY COMMANDS
		# Pre-primary
		--verbose | -v)
			echo _verbose;;
		--kill | -k)
			echo kill_docker_container
			return 0;;
		--pull | -p)
			echo pull_docker_image
			return 0;;
		--rebuild | -r)
			echo create_docker_image
			return 0;;
		--config | -f)
			echo gen_app_conf
			return 0;;
		--tag | -t)
			echo update_conf TAG
			return 1;;
		--env | -e)
			echo update_conf ENV
			return 1;;
		# Post-primary
		--dockershell | -l)
			echo docker exec -it "$APP" bash
			return 3;;
		--db-connect | -c)
			echo db_connect
			return 3;;
		--push | -u)
			echo push_docker_image
			return 3;;
		--clean | -n)
			echo clean_docker_images
			return 3;;
		--help | -h)
			echo _help
			return 3;;
		*)
			return 255;;
	esac
}

# The pre- and post-primary commands are placed in separate arrays to be executed at their respective times
PRE=()
PRIMARY=()
POST=()
for cmd in "$@"; do
	[[ "$cmd" = --verbose || "$cmd" = -v ]] && _verbose && continue
	next=$(parse_cmd $cmd)
	STAT=$?
	# If $previous is set, that means were looking for 
	if [ "$STAT" -eq 0 ]; then
		PRE+=( "$next" )
	elif [ "$STAT" -eq 1 ]; then
		echo 'one'
	elif [ "$STAT" -eq 2 ]; then
		[ -n "$PRIMARY" ] && _err "Multiple primary command issued: $cmd" -
		PRIMARY=$next
	elif [ "$STAT" -eq 3 ]; then
		POST+=( "$next" )
	elif [ "$STAT" -eq 4 ]; then
		echo 'four'
	fi
done

# Execute the commands in proper order
for cmd in "${PRE[@]}"; do $cmd; done
$PRIMARY
for cmd in "${POST[@]}"; do $cmd; done
