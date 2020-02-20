#include <stdio.h>
#include <stdlib.h>

#include "Window.h"
#include "DeploymentHelper.h"

int deploy_java() {

	system("sh ./scripts/java_dependencies.sh");

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
