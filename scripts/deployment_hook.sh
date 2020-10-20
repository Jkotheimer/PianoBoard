#!/usr/bin/env bash

. scripts/helpers.sh
. scripts/pianoboard.cfg
[ -z "$ROOT" ] && _error 'Pianoboard config not found. Please use ./run.sh' - -

# Elevate privileges
[ $EUID -eq 0 ] || {
	_warn "You must have root privileges to perform this operation"
	exec sudo "$0" "$@"
	exit 0
}

HTTPD_CONF=$ROOT/.dependencies/httpd/conf/httpd.conf
[ ! -f "$HTTPD_CONF.original" ] && cp $HTTPD_CONF "$HTTPD_CONF.original"

echo 'Filling template stuff in httpd.conf'
# $1 : either 'development' or 'production'. Fill the root directory in the selected template and copy to httpd conf
sed "s|{ROOT}|$ROOT|g" "scripts/web/httpd.conf-$1" > $HTTPD_CONF

echo 'Start server'
mkdir -p $ROOT/logs
$ROOT/.dependencies/httpd/bin/apachectl start
