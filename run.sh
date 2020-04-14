#!/usr/bin/env bash

# Ensure we are in the proper directory and import functions and variables
cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null 2>&1
ROOT_DIR=$(pwd)
source ./_scripts/functions.sh

print_help() {
	printf "\n${BLUE}HOW TO USE THIS SCRIPT:${NC}\n"
	echo "--help       [-h] : Display this prompt"
	echo "--all        [-a] : Refresh all Pianoboard services"
	echo "--server     [-s] : Refresh Apache Http server"
	echo "--database   [-d] : Refresh MySQL database (This drops all data)"
	echo "--client     [-c] : Refresh symlink from _client/ to htdocs in http server"
	echo "--test       [-t] : Run test SQL script to fill database with sample data"
	echo "--unset      [-u] : Unset all values from the database (similar to -d but no re-auth required)"
	echo "--reset      [-r] : Entirely recreate the database (use this if the model has been updated)"
	echo "________________________________________________________________________________________________"
}

declare -A COMMANDS=([-h]=print_help [--help]=print_help \
					[-a]=refresh_all [--all]=refresh_all \
					[-s]=refresh_server [--server]=refresh_server \
					[-d]=refresh_database [--database]=refresh_database \
					[-D]=refresh_database
					[-c]=refresh_client [--client]=refresh_client \
					[-t]=test_db [--test]=test_db \
					[-u]=clear_db [--unset]=clear_db \
					[-r]=refresh_database [--reset]=refresh_database)

# Create a list to append commands to
declare -A EXEC
for ARG in "$@"; do   
	NEXT=${COMMANDS[${ARG}]}
	
	if [ -z "${NEXT}" ]; then
		printf "Invalid argument: '${1}'\n"
		print_help
		exit -1
	fi
	
	case ${ARG} in
		-h | --help)
			print_help
			exit 0;;
		-a | --all)
			[ -z ${EXEC[${NEXT}]} ] && declare -A EXEC && EXEC[${NEXT}]=1
			break;;
		-t | --test | -u | --unset | -r | --reset)
			[ -z ${EXEC[${NEXT}]} ] && EXEC[${NEXT}]=2;;
		*)
			[ -z ${EXEC[${NEXT}]} ] && EXEC[${NEXT}]=1;;
	esac
done

[[ ! -f app.cfg && -d _dependencies/ ]] && {
	refresh_all ${ROOT_DIR}
	exit 0
}
if [[ -f app.cfg && -d _dependencies/ ]]; then
	source ./app.cfg
	if [ $# -eq 0 ]; then
		refresh_all ${ROOT_DIR} 
		exit 0
	fi
	for i in "${!EXEC[@]}"; do
		[ ${EXEC[$i]} -eq 1 ] && $i ${ROOT_DIR}
		[ ${EXEC[$i]} -eq 2 ] && $i ${ROOT_DIR} ${DB_USERNAME} ${DB_PASS} 
	done
else
	printf "${WARNING}Dependency configurations not found.\n"
	[ -n "${1}" ] && printf "Ignoring command line argument: ${1}\n"
	printf "Download dependencies now? [Y/n] "
	read -sn1 CHOICE
	while [[ ${CHOICE^^} != 'Y' && ${CHOICE^^} != 'N' && ${CHOICE} != '' ]]; do
		read -sn1 CHOICE
	done
	printf "${CHOICE}\n"
	[[ ${CHOICE^^} = 'Y' || -z ${CHOICE} ]] && sudo ./_scripts/download_dependencies.sh $USER
fi

