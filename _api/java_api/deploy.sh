printf "Java program\n"
fuser -k 8080/tcp
fuser -k 8081/tcp
mvn clean compile war:war
echo START > catalina.out
cd /home/student/apache/apache-tomcat-8.5.49/
rm webapps/web_service-1.0-SNAPSHOT.war
rm -r webapps/web_service-1.0-SNAPSHOT/
rm -r work/*
rm -r temp/*
cp ~/Documents/pianoboard/_api/target/web_service-1.0-SNAPSHOT.war webapps/
sh ./bin/startup.sh
