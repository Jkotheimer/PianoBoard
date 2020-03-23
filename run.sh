#!/usr/bin/env bash

# Ensure we are in the proper directory
cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null 2>&1

print_help() {
	#TODO
}

if [ $# -gt 1 ]; then
	printf "Too many arguments\n"
	print_help
	exit -1
fi

declare -A COMMANDS
for const in ('h' 'a' 's' 'd' 'help' 'all' 'server' 'database'); do
	COMMANDS[$const]=1
done

if [[ ! ${COMMANDS[${1}]} ]]; then
	printf "Argument '${1}' unknown\n"
	print_help
fi

if [[ ]]

if [[ -f run.cfg && -d _dependencies/ ]]; then
	source run.cfg
	curl -m 5 http://localhost:80 > /dev/null 2>&1
	if [[ ! $? -eq 0 || "${1}" == "refresh_server" ]]; then
		refresh_server
	fi
	if [[ "${1}" == "refresh_database" ]]; then
		source ./_scripts/functions.sh
		create_database $(pwd)
	fi
	refresh_client
else
	printf "Dependency configurations not found.\n"
	if [ -n ${1} ]; then
		printf "Ignoring command line argument: ${1}"
	fi
	printf "Download dependencies now? [Y/n] "
	read -n1 CHOICE
	printf "\n"
	if [[ ! ${CHOICE^^} -eq 'N']]; then
		sudo ./_scripts/download_dependencies.sh
	fi
fi

