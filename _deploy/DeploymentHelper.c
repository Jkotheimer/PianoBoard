#include <stdio.h>
#include <stdlib.h>
#include <libconfig.h>

#include "Window.h"
#include "DeploymentHelper.h"

int deploy_java() {

	config_t cfg;
	config_setting_t *root, *setting;
	const char *str;

	config_init(&cfg);
	root = config_root_setting(&cfg);

	setting = config_setting_add(root, "CATALINA_HOME", CONFIG_TYPE_STRING);
	config_setting_set_string(setting, "/opt/apache-tomcat-directory");

	setting = config_setting_add(root, "CXF_HOME", CONFIG_TYPE_STRING);
	config_setting_set_string(setting, "/opt/apache-cxf-directory");

	setting = config_setting_add(root, "HTTPD_HOME", CONFIG_TYPE_STRING);
	config_setting_set_string(setting, "/opt/apache-httpd-directory");

	return 0;
}

int deploy_python() {
	FILE *conf = fopen(CONFIGFILE, "W");
	return 0;
}

int deploy_node() {
	FILE *conf = fopen(CONFIGFILE, "W");
	return 0;
}
