#!usr/bin/env bash

[[ ! $(command -v node) || ! $(command -v npm) ]] && {
	apt --yes install nodejs npm
	[ $? != 0 ] && {
		apt --yes update
		apt --yes install nodejs npm
	}
}
cd /api
[ ! -d node_modules/ ] && {
	npm install express cookie-parser fs path email-validator mysql
}
exit 0
