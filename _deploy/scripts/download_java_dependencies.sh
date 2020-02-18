wget -O /tmp/cxf		http://apache.mirrors.pair.com/cxf/3.3.5/apache-cxf-3.3.5.tar.gz
wget -O /tmp/tomcat		http://mirror.metrocast.net/apache/tomcat/tomcat-8/v8.5.51/bin/apache-tomcat-8.5.51.tar.gz
wget -O /tmp/httpd		http://mirrors.ibiblio.org/apache/httpd/binaries/netware/httpd_2.4.10-netware-bin.zip

cd ../../
export JDIR='readlink -f $(find . -type d -name "java_api")'
cd $JDIR

rm -rf dependencies/
mkdir dependencies/

tar -xvzf /tmp/cxf -C		dependencies/
tar -xvzf /tmp/tomcat -C	dependencies/
unzip /tmp/httpd -d			dependencies/
mv dependencies/Apache24 dependencies/apache-httpd

export CATALINA_HOME="$JDIR/dependencies/apache-tomcat-8.5.51"
export CXF_HOME="$JDIR/dependencies/apache-cxf-3.3.5"
export HTTPD_HOME="$JDIR/dependencies/apache-httpd"

# Set up the cxf library in the source directory
cp $CFX_HOME/lib $JDIR/src/main/WebContent/lib
