#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "Window.h"
#include "DeploymentHelper.h"

char* USER;

int deploy_java() {

	char pre_comm[512] = "sh ./scripts/java_dependencies.sh ";
	char* command = strcat(pre_comm, USER);

	system(command);

	return 0;
}

int deploy_python() {

	// TODO Create a script to deploy the python implementation

	return 0;
}

int deploy_node() {

	// TODO Create a script to deploy the node.js implementation

	return 0;
}

void set_user(char* u) {
	USER = u;
}
