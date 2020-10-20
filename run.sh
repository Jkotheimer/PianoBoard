#!/usr/bin/bash

# Ensure we are in the project root directory (where this script lives)
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
echo "ROOT='$ROOT'" > scripts/pianoboard.cfg
cd $ROOT

# Grab our helper functions, including pretty printers, db helpers, etc.
source scripts/helpers.sh

# Ensure all system dependencies are satisfied to run this project
check_dependencies

# Ensure only 1 argument was provided
[ $# -ne 1 ] && display_help && _error 'This script requires exactly one argument' - -

# Execute the selected function
case $1 in
	'--help' | '-h')
		display_help;;
	'--dev' | '-d')
		./scripts/deployment_hook.sh development;;
	'--stage' | '-s')
		./scripts/deployment_hook.sh production --staging;;
	'--prod' | '-x')
		./scripts/deployment_hook.sh production --production;;
	'--db-connect' | '-c')
		pb_db_connect;;
	'--db-reset' | '-r')
		pb_db_reset;;
	'--db-password' | '-p')
		reset_db_password;;
	*)
		_error "Invalid argument: $1" -;;
esac
