#!/bin/bash
GREEN="\033[0;32m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m"
DONE="\r[${GREEN}DONE${NC}]\n"
T="\t"

# cd into the scripts directory from either the root or _deploy directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR
source functions.sh

if [ ! ${1} ]; then
	printf "${RED}\nPlease pass \$USER environment variable as an argument${NC}\n"
	exit -1
fi

# Extract the
printf "${NC}${T}Fetching your mirror..."
wget -O ./mirrors.txt http://ws.apache.org/mirrors.cgi 2> /dev/null
MIRROR=$(grep -E '<p><a href=.*</strong></a>' mirrors.txt | cut -d '"' -f 2)
rm mirrors.txt
printf ${DONE}

printf "${BLUE}Your mirror is ${MIRROR}${NC}\n"

printf "${BLUE}Checking for dependencies...${NC}\n"
if [ ! -f /tmp/cxf.tar.gz ]; then
	printf "${T}Downloading CXF..."
	sudo -u ${1} -H wget -O /tmp/cxf.tar.gz			${MIRROR}/cxf/3.3.5/apache-cxf-3.3.5.tar.gz > /dev/null
	printf ${DONE}
fi

if [ ! -f /tmp/tomcat.tar.gz ]; then
	printf "${T}Downloading Tomcat..."
	sudo -u ${1} -H wget -O /tmp/tomcat.tar.gz		${MIRROR}/tomcat/tomcat-8/v8.5.51/bin/apache-tomcat-8.5.51.tar.gz > /dev/null
	printf ${DONE}
fi

if [ ! -f /tmp/httpd.tar.gz ]; then
	printf "${T}Downloading HTTPD..."
	sudo -u ${1} -H wget -O /tmp/httpd.tar.gz		${MIRROR}/httpd/httpd-2.4.41.tar.gz > /dev/null
	printf ${DONE}
fi

if [[ ! $(exists mvn) ]]; then
	printf "${T}Downloading Maven..."
	sudo -u ${1} -H wget -O /tmp/maven.tar.gz		${MIRROR}/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz > /dev/null
	printf ${DONE}
fi

if [[ ! $(exists pcre-config) ]]; then
	printf "${T}Downloading pcre..."
	sudo -u ${1} -H wget -O /tmp/pcre.tar.gz		https://ftp.pcre.org/pub/pcre/pcre-8.44.tar.gz > /dev/null
	printf ${DONE}
fi

printf "${GREEN}All dependencies downloaded successfully${NC}\n\n"

# Find the java_api directory (This script may be called from multiple different sources)
printf "${T}Moving into Java API deployment directory..."
while [ ! -d ./_api ]
do
	cd ..
done
# We are now in the pianoboard root directory
ROOT_DIR=$(pwd)
JDIR=$(pwd)/_api/java_api
cd ${JDIR}
printf ${DONE}

rm -rf dependencies/ 2> /dev/null
mkdir -m 777 ./dependencies/

printf "${T}Extracting CXF..."
sudo -u ${1} -H tar -xvzf /tmp/cxf.tar.gz		-C ./dependencies/ > /dev/null
sudo -u ${1} -H mv ./dependencies/apache-cxf-3.3.5 ./dependencies/apache-cxf
CXF_HOME=${JDIR}/dependencies/apache-cxf
printf ${DONE}

printf "${T}Extracting Tomcat..."
sudo -u ${1} -H tar -xvzf /tmp/tomcat.tar.gz	-C ./dependencies/ > /dev/null
sudo -u ${1} -H mv ./dependencies/apache-tomcat-8.5.51 ./dependencies/apache-tomcat
CATALINA_HOME=${JDIR}/dependencies/apache-tomcat
printf ${DONE}

printf "${T}Extracting HTTPD..."
sudo -u ${1} -H tar -xvzf /tmp/httpd.tar.gz		-C ./dependencies/ > /dev/null
mkdir -m 777 ./dependencies/apache-httpd
HTTPD_SRC=${JDIR}/dependencies/httpd-2.4.41
HTTPD_HOME=${JDIR}/dependencies/apache-httpd
printf ${DONE}

if [[ ! $(exists mvn) ]]; then
	printf "${T}Extracting Maven..."
	sudo -u ${1} -H tar -xvzf /tmp/maven.tar.gz	-C /opt/ > /dev/null
	chmod -R 777 /opt/apache-maven-3.6.3
	printf ${DONE}
	printf "${T}Linking maven binaries to /usr/bin ..."
	ln -sf /opt/apache-maven-3.6.3/bin/* /usr/bin/ > /dev/null
	printf ${DONE}
fi

if [[ ! $(exists pcre-config) ]]; then
	printf "${T}Extracting pcre..."
	sudo -u ${1} -H tar -xvzf /tmp/pcre.tar.gz -C /opt/ > /dev/null
	chmod -R 777 /opt/pcre-8.44
	printf ${DONE}
	printf "${T}Building pcre source ..."
	rm -rf /opt/pcre 2> /dev/null
	mkdir -m 777 /opt/pcre
	cd /opt/pcre-8.44
	./configure --prefix=/opt/pcre/ > /dev/null 2>&1
	make > /dev/null 2>&1
	make install > /dev/null 2>&1
	rm -rf /opt/pcre-8.44 2> /dev/null
	printf ${DONE}
	printf "${T}Linking pcre binaries to /usr/bin ..."
	ln -sf /opt/pcre/bin/* /usr/bin/ > /dev/null
	printf ${DONE}
fi

chmod -R 777 ./dependencies/

# Set up the cxf library in the source directory
printf "${T}Copying CXF library into Java source dependency directory..."
rm -rf ${JDIR}/src/main/WebContent/WEB-INF/lib 2> /dev/null
mkdir -m 777 ${JDIR}/src/main/WebContent/WEB-INF/lib
cp -avr ${CXF_HOME}/lib/* ${JDIR}/src/main/WebContent/WEB-INF/lib > /dev/null
printf ${DONE}

# Install and configure the HTTP server
printf "${T}Installing Apache Http Server..."
cd ${HTTPD_SRC}/
./configure --prefix=${HTTPD_HOME}/ > /dev/null
make > /dev/null 2>&1
make install > /dev/null 2>&1
printf ${DONE}


# Set configuration setting specific to PianoBoard
printf "${T}Configuring PianoBoard specific settings in httpd.conf..."
cd ${HTTPD_HOME}/
rm -r ${HTTPD_SRC}/
HTTPD_CONF=${HTTPD_HOME}/conf/httpd.conf
echo "ServerName http://localhost:80
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_connect_module modules/mod_proxy_connect.so
ProxyPass			/api	http://localhost:8081/
ProxyPassReverse	/api	http://localhost:8081/
" >> ${HTTPD_CONF}
printf ${DONE}

printf "${T}Creating symlink from client to HTTPD document root..."
DOCROOT=$(grep 'DocumentRoot "' ${HTTPD_CONF} | cut -d '"' -f 2 | tr -d '\r')
rm -f ${DOCROOT}/index.html 2> /dev/null
ln -sf ${ROOT_DIR}/_client/* ${DOCROOT}
printf ${DONE}

printf "${T}Starting HTTPD server..."
# Kill any processes running on port 80 and wait a couple seconds for them to full shut down
fuser -k 80/tcp > /dev/null 2>&1
sleep 2

# FIXME If this returns an error, output an error message of some sort and exit
sudo ${HTTPD_HOME}/bin/apachectl -k start
printf ${DONE}
printf "${BLUE}${T}HTTPD started, listening at localhost:80${NC}\n"

printf "${T}Creating root config file..."
cd $ROOT_DIR
rm -f ./deploy.cfg 2> /dev/null
install -m 777 /dev/null ./deploy.cfg
echo "IMPL=${JDIR}
SCRIPT=\"./deploy.sh
${HTTPD_HOME}/bin/apachectl -k start\"
" > ./deploy.cfg
printf ${DONE}

printf "${T}Creating Java config file..."
cd ${JDIR}
rm -f ./deploy.cfg 2> /dev/null
install -m 777 /dev/null ./deploy.cfg
echo "CATALINA_HOME=${CATALINA_HOME}
CXF_HOME=${CXF_HOME}
HTTPD_HOME=${HTTPD_HOME}
JDIR=${JDIR}" > ./deploy.cfg
printf ${DONE}

printf "${T}Creating deployment script..."
rm -f ./deploy.sh 2> /dev/null
install -m 777 /dev/null ./deploy.sh
echo "#!/bin/bash
if [ \$USER != \"${1}\" ]; then
	printf \"[${RED}ERROR${NC}]\tThis configuration is set for ${1}, but you are signed in as \${USER}.\n\"
	printf \"[${RED}ERROR${NC}]\tPlease sign in as ${1} and try again.\"
	exit -1
fi
source ./deploy.cfg

# Check if apachectl is running (The jank way because 'apachectl status' uses lynx, an uncommon tool)
curl http://localhost:80 > /dev/null 2>&1
A_STATUS=\$?
if [ ! \${A_STATUS} -eq 0 ]; then
	printf \"[${RED}ERROR ${NC}]\tApache http server not running.\"
	printf \"${T}Starting apachectl now...\"
	sudo fuser -k 80/tcp > /dev/null 2>&1
	sudo ${HTTPD_HOME}/bin/apachectl start > /dev/null
	${DONE}
fi

# Compile the source into a war file
sudo -u ${1} -H mvn clean compile war:war

# Remove any previous reminants of the previous build
cd \${CATALINA_HOME}
sudo -u ${1} -H ./bin/shutdown.sh > /dev/null 2>&1
rm -f webapps/web_service-1.0-SNAPSHOT.war 2> /dev/null
rm -rf webapps/web_service-1.0-SNAPSHOT/ 2> /dev/null
rm -rf work/* 2> /dev/null
rm -rf temp/* 2> /dev/null

# Kill anything running on ports 8080 and 8081
fuser -k 8080/tcp > /dev/null 2>&1
fuser -k 8081/tcp > /dev/null 2>&1
fuser -k 8005/tcp > /dev/null 2>&1
fuser -k 8009/tcp > /dev/null 2>&1

# It often takes a moment for these changes to take effect
sleep 2

# Copy the new war file into Cataline and start the servlet
sudo -u ${1} -H cp \${JDIR}/target/web_service-1.0-SNAPSHOT.war webapps/
sudo -u ${1} -H ./bin/startup.sh" > deploy.sh
chmod +x ./deploy.sh
printf ${DONE}

printf "${T}Deploying Pianoboard..."
# Kill anything running on ports 8080 and 8081
fuser -k 8080/tcp > /dev/null 2>&1
fuser -k 8081/tcp > /dev/null 2>&1
fuser -k 8005/tcp > /dev/null 2>&1
sudo -u ${1} -H ./deploy.sh > /dev/null
printf ${DONE}

lh="http://localhost:80"
if [[ $(exists firefox) ]]; then
	echo "Opening in Firefox"
	sudo -u ${1} -H firefox ${lh}
elif [[ $(exists chromium) ]]; then
	echo "Opening in Chromium"
	sudo -u ${1} -H chromium ${lh}
elif [[ $(exists chrome) ]]; then
	echo "opening in Chrome"
	sudo -u ${1} -H chrome ${lh}
elif [[ $(exists opera) ]]; then
	echo "Opening in Opera"
	sudo -u ${1} -H opera ${lh}
else
	echo "Opening with xdg-open"
	xdg-open ${lh}
fi

exit 0
