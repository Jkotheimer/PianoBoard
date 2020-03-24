#!/usr/bin/env bash

# Ensure we are in the proper directory and import functions and variables
cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null 2>&1
source ./_scripts/functions.sh

print_help() {
	printf "\n${BLUE}HOW TO USE THIS SCRIPT:${NC}\n"
	echo "--help       [-h] : Display this prompt"
	echo "--all        [-a] : Refresh all Pianoboard services"
	echo "--server     [-s] : Refresh Apache Http server"
	echo "--database   [-d] : Refresh MySQL database (This drops all data)"
	echo "--client     [-c] : Refresh symlink from _client/ to htdocs in http server"
	echo "____________________________________________________________________________"
}

declare -A COMMANDS=([-h]=print_help [--help]=print_help \
					[-a]=refresh_all [--all]=refresh_all \
					[-s]=refresh_server [--server]=refresh_server \
					[-d]=refresh_database [--database]=refresh_database \
					[-c]=refresh_client [--client]=refresh_client)

# Create a list to append commands to
declare -A EXEC
for ARG in "$@"; do   
	NEXT=${COMMANDS[${ARG}]}
	if [ -z "${NEXT}" ]; then
		printf "Invalid argument: '${1}'\n"
		print_help
		exit -1
	elif [[ "${NEXT}" == "-h" || "${NEXT}" == "--help" ]]; then
		print_help
		exit 0
	elif [[ "${NEXT}" == "-a" || "${NEXT}" == "--all" ]]; then
		refresh_all ${ROOT_DIR}
		exit 0
	elif [ -z ${EXEC[${NEXT}]} ]; then
		EXEC[${NEXT}]=1
	fi
done

if [[ -f run.cfg && -d _dependencies/ ]]; then
	source run.cfg
	for i in "${!EXEC[@]}"; do
		$i ${ROOT_DIR}
	done
else
	printf "${WARNING}Dependency configurations not found.\n"
	[ -n ${1} ] && printf "Ignoring command line argument: ${1}\n"
	printf "Download dependencies now? [Y/n] "
	read -n1 CHOICE
	printf "\n"
	[[ ${CHOICE^^} = 'Y' || -z ${CHOICE} ]] && sudo ./_scripts/download_dependencies.sh
fi

