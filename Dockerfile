FROM mattrayner/lamp AS dev
MAINTAINER Jack Kotheimer
LABEL app.pianoboard.version="0.0.1-beta"

# From fauria/lamp README: -p [HOST WWW PORT NUMBER]:80 -p [HOST DB PORT NUMBER]:3306 -v [HOST WWW DOCUMENT ROOT]:/var/www/html -v [HOST DB DOCUMENT ROOT]:/var/lib/mysql
# Copy the aforementioned directories, as well as a separate directory for the api, and the 2 apache config files
EXPOSE 80/tcp
EXPOSE 3306/tcp

COPY ./api /var/www/api
COPY ./client /var/www/html
COPY ./database /var/lib/mysql
COPY ./config/dev /var/www/config

ENV DEBIAN_FRONTEND noninteractive
ENV PHP_TIMEZONE America/Chicago
ENV PHP_POST_MAX_SIZE 5M
ENV PHP_UPLOAD_MAX_FILESIZE 10M

RUN apt-get -y update;
RUN apt-get -y install nodejs npm mysql-server apache2; \
	cd /var/www/api && npm install express cookie-parser fs path email-validator mysql; \
	chmod +x /var/www/config/deploy.sh;

# TODO: implement for a secure staging environment
