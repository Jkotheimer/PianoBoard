#include <X11/Xlib.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "window.h"

int main(void) {

	Window w;
	BLUE;
	printf("\nInitializing window...\n");
	Display *d = init_window(&w);
	GREEN;
	printf("Window is officially mapped: %lu \n", w);

	BLUE;
	printf("Starting event loop...\n");

	int exit_code = -1;
	exit_code = event_loop(w, d);

	NC;
	printf("\nEvent loop exited with exit code %d \n", exit_code);

	XCloseDisplay(d);

	return exit_code;
}

Display *init_window(Window *w) {

	BLUE;
	printf("Opening display...\n");
	Display *d = XOpenDisplay(NULL);
	if (d == NULL) {
		fprintf(stderr, "Cannot open display\n");
		return NULL;
	}
	GREEN;
	printf("Display is opened properly\n");

	int s = DefaultScreen(d);
	*w = XCreateSimpleWindow(d, RootWindow(d, s), WIN_X, WIN_Y, WIN_W, WIN_H, s, GREY, CREAM);
	NC;
	printf("Window instantiated\n");
	XSelectInput(d, *w, ExposureMask | ButtonPressMask);
	printf("Event listeners set\n");
	XMapWindow(d, *w);

	return d;
}

int event_loop(Window w, Display *d) {

	int s = DefaultScreen(d);
	XEvent e;

	BLUE;
	printf("Listening for events...\n\n");
	GREEN;

	while(1) {
		XNextEvent(d, &e);
		if (e.type == Expose) {
			draw_gui(d, w, s);
		}
		if (e.type == ButtonPress || e.type == ButtonRelease) {
			XButtonEvent click = e.xbutton;

			if(clicked(click.x, click.y, J_BUTTON_X)) {
				printf("Java implementation selected\n\n");
				NC;
				system(J_COMMAND);
				return 0;
			}
			else if(clicked(click.x, click.y, P_BUTTON_X)) {
				printf("Python implementation selected\n\n");
				NC;
				system(P_COMMAND);
				return 0;
			}
			else if(clicked(click.x, click.y, N_BUTTON_X)) {
				printf("Node.js implemenation selected\n\n");
				NC;
				system(N_COMMAND);
				return 0;
			}
		}
	}
	return 0;
}

void draw_gui(Display *d, Window w, int s) {

	GREEN;
	char *msg = "With which tool would you like to deploy PianoBoard?";

	XSetForeground (d, DefaultGC(d, s), GREY);
	XDrawString(d, w, DefaultGC(d, s), MSG_X, MSG_Y, msg, strlen(msg));

	XSetForeground(d, DefaultGC(d, s), PURPLE);
	XFillRectangle(d, w, DefaultGC(d, s), J_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XFillRectangle(d, w, DefaultGC(d, s), P_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XFillRectangle(d, w, DefaultGC(d, s), N_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);

	XSetForeground(d, DefaultGC(d, s), GREY);
	XDrawRectangle(d, w, DefaultGC(d, s), J_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XDrawRectangle(d, w, DefaultGC(d, s), P_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XDrawRectangle(d, w, DefaultGC(d, s), N_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
}

int clicked(int x, int y, int button_x) {
	if (x > button_x &&
		x < (button_x + BUTTON_W) &&
		y > BUTTON_Y &&
		y < (BUTTON_Y + BUTTON_H)) {
		return 1;
	} else {
		return 0;
	}
}
