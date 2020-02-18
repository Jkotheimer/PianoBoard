GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m"

printf "\n${RED}Downloading dependencies...${NC}\n"
printf "Downloading CXF...\n"
wget -O /tmp/cxf		http://apache.mirrors.pair.com/cxf/3.3.5/apache-cxf-3.3.5.tar.gz
printf "${GREEN}CXF download complete${NC}\n"
printf "Downloading Tomcat...\n"
wget -O /tmp/tomcat		http://mirror.metrocast.net/apache/tomcat/tomcat-8/v8.5.51/bin/apache-tomcat-8.5.51.tar.gz
printf "${GREEN}Tomcat download complete${NC}\n"
printf "Downloading HTTPD...\n"
wget -O /tmp/httpd		http://mirrors.gigenet.com/apache//httpd/httpd-2.4.41.tar.gz
printf "${GREEN}HTTPD download complete\n\n"
printf "All dependencies downloaded successfully${NC}\n\n"

# Find the java_api directory (This script may be called from multiple different sources)
cd ../../
JDIR=$(readlink -f $(find . -type d -name 'java_api') | tr -d '\r')
CLIENT=$(readlink -f $(find . -type d -name '_client') | tr -d '\r')
cd ${JDIR}

rm -rf	dependencies/
mkdir	dependencies/

printf "${RED}Extracting dependencies...${NC}\n"
printf "Extracting CXF...\n"
tar -xvzf /tmp/cxf		-C dependencies/ > /dev/null
printf "${GREEN}CXF extracted${NC}\n\n"
printf "Extracting Tomcat...\n"
tar -xvzf /tmp/tomcat	-C dependencies/ > /dev/null
printf "${GREEN}Tomcat extracted${NC}\n\n"
printf "Extracting HTTPD...\n"
tar -xvzf /tmp/httpd	-C dependencies/ > /dev/null
printf "${GREEN}HTTPD extracted${NC}\n\n"

CATALINA_HOME="${JDIR}/dependencies/apache-tomcat-8.5.51"
CXF_HOME="${JDIR}/dependencies/apache-cxf-3.3.5"
HTTPD_SRC="${JDIR}/dependencies/httpd-2.4.41"
HTTPD_HOME="${JDIR}/dependencies/httpd"

# Set up the cxf library in the source directory
rm -rf ${JDIR}/src/main/WebContent/WEB-INF/lib
mkdir ${JDIR}/src/main/WebContent/WEB-INF/lib
printf "Copying CXF library into Java source dependency directory...\n"
cp -avr ${CXF_HOME}/lib/* ${JDIR}/src/main/WebContent/WEB-INF/lib > /dev/null
printf "${GREEN}CXF configuration complete${NC}\n\n"

# Install and configure the HTTP server
cd ${HTTPD_SRC}
printf "Installing Apache Http Server...\n"
./configure --prefix=${HTTPD_HOME} > /dev/null
make > /dev/null
make install > /dev/null 2>&1
printf "${GREEN}Apache HTTPD installed${NC}\n\n"

cd ${HTTPD_HOME}
rm -rf ${HTTPD_SRC}

HTTPD_CONF=${HTTPD_HOME}/conf/httpd.conf
echo 'ServerName localhost' >> ${HTTPD_CONF}
DOCROOT=$(grep 'DocumentRoot "' ${HTTPD_CONF} | cut -d '"' -f 2 | tr -d '\r')
rm ${DOCROOT}/index.html
printf "Creating symlink from client to HTTPD document root...\n"
ln -sf ${CLIENT}/* ${DOCROOT} > /dev/null
printf "${GREEN}Client files configured${NC}\n\n"
printf "Starting HTTPD server...\n"
sudo ${HTTPD_HOME}/bin/apachectl -k start
printf "${GREEN}HTTPD started, listening at localhost:80${NC}\n\n"
