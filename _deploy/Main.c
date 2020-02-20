#include <X11/Xlib.h>
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>

#include "Window.h"

int WIN_X;

void interrupt() {
	NC printf("Exiting...\n");
	exit(0);
}

int main(void) {

	BLUE printf("\nInitializing window...\n");
	Window window;
	Display *display = init_window(&window);

	GREEN printf("Window is officially mapped: %lu \n\n", window);

	BLUE printf("Starting event loop...\n");

	signal(SIGINT, interrupt);

	int exit_code = -1;
	exit_code = event_loop(window, display); // Event loop starts here (see Window.h)

	NC printf("\nEvent loop exited with exit code %d\n\n", exit_code);

	XCloseDisplay(display);

	return exit_code;
}
