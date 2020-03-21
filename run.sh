#!/usr/bin/env bash
if [ -f run.cfg ]; then
	source run.cfg
	curl -m 5 http://localhost:80 > /dev/null 2>&1
	if [ ! $? ]; then
		refresh_server
	fi
	refresh_client
else
	sudo ./_scripts/download_dependencies.sh ${USER}
fi

