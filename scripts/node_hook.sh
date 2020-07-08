#!/usr/bin/env bash

[[ ! $(command -v node) || ! $(command -v npm) ]] && {
	apt-get --yes update
	apt-get --yes install nodejs npm
}
cd /api
[ ! -d node_modules/ ] && npm install express cookie-parser fs path email-validator util mysql > /dev/null 2>&1
node app.js > server.log 2>&1 &
