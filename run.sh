#!/usr/bin/env bash
if [ -d ./dependencies ]; then
	sudo fuser -k 80/tcp
	sudo ./dependencies/apache-httpd/bin/apachectl start
else
	sudo ./download_dependencies.sh ${USER}
fi
