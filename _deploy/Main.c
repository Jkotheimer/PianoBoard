#include <X11/Xlib.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "Window.h"
#include "FontHandler.h"

int WIN_X;

int main(void) {

	BLUE
	printf("\nInitializing window...\n");
	Window window;
	Display *display = init_window(&window);

	GREEN
	printf("Window is officially mapped: %lu \n", window);

	BLUE
	printf("Starting event loop...\n");

	int exit_code = -1;
	exit_code = event_loop(window, display);

	NC
	printf("\nEvent loop exited with exit code %d\n\n", exit_code);

	XCloseDisplay(display);

	return exit_code;
}
