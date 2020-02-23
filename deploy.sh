#!/bin/bash

# Color codes
NC="\033[0m"
PURPLE="\033[0;35m"
YELLOW="\033[1;33m"
RED="\033[0;31m"

if [ $USER = "root" ]; then
	printf "${RED}You are running as root. Are you sure you wish to continue?${NC} [y/N] "
	read -n1 CONTINUE
	printf "\n"
	if [ "${CONTINUE}" != 'y' ]; then
		printf "Exiting...\n"
		exit 0
	fi
fi

# If an implementation has already been selected, there will be a configuration file to read from
if [ -f deploy.cfg ]; then
	source ./deploy.cfg
	cd ${IMPL}
	${SCRIPT}
	exit 0
fi

# Option and command arrays for selection and execution
OPTIONS=("Java CXF/Tomcat Servlet" "Python Flask Server" "Node.js Server")
COMMANDS=("java_init.sh" "python_init.sh" "node_init.sh")

run() {
	local SELECTED=0
	local NUM_OPT=3
	local NEXT_KEY
	while true ; do
		gen_ui ${SELECTED}
		get_key NEXT_KEY
		handle_key "${NEXT_KEY}" SELECTED ${NUM_OPT}
	done
}


get_key() {
	local -n KEY=${1}
	read -sn1 KEY
	read -sn1 -t 0.0001 k1
	read -sn1 -t 0.0001 k2
	read -sn1 -t 0.0001 k3
	KEY+=${k1}${k2}${k3}
}

# $1 : The keypress being handled
# $2 : The current selection number
# $3 : The number of options to select from
handle_key() {

	# Make reference to SELECTED variable from run()
	local -n SEL=${2}
	local NUM_OPT=${3}

	case ${1} in

		# MOVE SELECTOR RIGHT
		'k'|'l'|'d'|'s'|$'\e[B'|$'\e0B'|$'\e[C'|$'\e0C') SEL=$(( (SEL+1)%NUM_OPT ));;

		# MOVE SELECTOR LEFT
		'i'|'j'|'a'|'w'|$'\e[A'|$'\e0A'|$'\e[D'|$'\e0D')
			SEL=$(( SELECTED-1 ))
			if [ ${SEL} -eq -1 ]; then
				SEL=$(( NUM_OPT-1 ))
			fi;;

		# MOVE SELECTOR TO HOME
		$'\e[1~'|$'\e0H'|$'\e[H') SEL=0;;

		# MOVE SELECTOR TO END
		$'\e[4~'|$'\e0F'|$'\e[F') SEL=$(( NUM_OPT-1 ));;

		# SUBMIT THE CURRENT SELECTION
		'') submit ${SEL};;

		# EXIT PROGRAM
		'q') clear; exit 0;;
	esac
	return 0
}

gen_ui() {
	clear
	printf "\n\t${PURPLE}With which tool would you like to deploy PianoBoard?${NC}\n"
	for i in ${!OPTIONS[@]}; do
		ELEMENT=${OPTIONS[i]}
		# If this is the selected element, draw a box around it
		if [ $i -eq $1 ]; then
			printf "\t "
			for (( i=0; i<$(( ${#ELEMENT} + 2 )); i++ )); do
				printf "-"
			done
			printf "\n\t| ${YELLOW}${ELEMENT}${NC} |\n\t "
			for (( i=0; i<$(( ${#ELEMENT} + 2 )); i++ )); do
				printf "-"
			done
		else
			printf "\n\t  ${ELEMENT}\n"
		fi
	done
	printf "\n"
}

submit() {
	clear
	printf "Initializing ${OPTIONS[$1]}\n"

	# Ensure we are in the correct directory before executing the command
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
	cd $DIR/_deploy/
	sudo bash ${COMMANDS[$1]} $USER
	exit 0
}

run
