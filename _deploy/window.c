#include <X11/Xlib.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <graphics.h>

#include "window.h"

int main(void) {

	Display *d;
	printf("Initializing window...\n");
	Window w =_init_window(d);
	printf("Window is officially mapped: %lu \n", w);

	printf("Starting event loop...\n");
	int exit_code = 0;
	exit_code = event_loop(w, d);
	printf("Event loop exited with exit code %d \n", exit_code);

	printf("Closing diplay...\n");
	XCloseDisplay(d);
	printf("Display closed\n");
	return exit_code;
}

Window _init_window(Display *d) {

	d = XOpenDisplay(NULL);
	if (d == NULL) {
		fprintf(stderr, "Cannot open display\n");
		exit(1);
	}
	printf("Display is opened properly\n");
	int s = DefaultScreen(d);
	Window w = XCreateSimpleWindow(d, RootWindow(d, s), 10, 10, 100, 100, 1, BlackPixel(d, s), WhitePixel(d, s));
	printf("Window created\n");
	XSelectInput(d, w, ExposureMask | KeyPressMask);
	printf("Input mask set\n");
	XMapWindow(d, w);
	printf("Window mapped\n");

	return w;
}

int event_loop(Window w, Display *d) {

	int s = DefaultScreen(d);
	XEvent e;

	char *msg = "Hello, World!";

	while (1) {
		XNextEvent(d, &e);
		if (e.type == Expose) {
			XFillRectangle(d, w, DefaultGC(d, s), 100, 30, 10, 10);
			XDrawString(d, w, DefaultGC(d, s), 10, 50, msg, strlen(msg));
		}
		if (e.type == KeyPress) {
			return -1;
		}
	}
	return 0;
}
