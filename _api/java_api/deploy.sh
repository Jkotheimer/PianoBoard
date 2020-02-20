source ./deploy.cfg

# Kill anything running on ports 8080 and 8081
fuser -k 8080/tcp
fuser -k 8081/tcp

# Compile the source into a war file
mvn clean compile war:war

# Remove any previous reminants of the previous build
cd ${CATALINA_HOME}
rm -f webapps/web_service-1.0-SNAPSHOT.war 2> /dev/null
rm -rf webapps/web_service-1.0-SNAPSHOT/ 2> /dev/null
rm -rf work/* 2> /dev/null
rm -rf temp/* 2> /dev/null

# It often takes a moment for these changes to take effect
sleep 3

# Copy the new war file into Cataline and start the servlet
cp ${JDIR}/target/web_service-1.0-SNAPSHOT.war webapps/
sh bin/startup.sh
