#!/bin/bash
dialog --menu "How would you like to deploy PianoBoard?" 16 50 3 \
1 "Java CXF/Tomcat Servlet" \
2 "Node.js server" \
3 "Python server"
clear

echo $SELECTION

CFG=./deployment.config
if test -f "$CFG"; then
	echo "$CFG exists: reading config file now"
else
	touch deployment.config
	DIR=""
	printf "Enter the directory to your Apache Tomcat directory (press enter if you don't have Tomcat installed yet): ";
	read DIR
	if [ "$DIR" = "" ]; then
		echo "Installing Tomcat for you..."
		# TODO install tomcat in the root directory for the user
	else
		ls $DIR
	fi
fi

rm deployment.config
