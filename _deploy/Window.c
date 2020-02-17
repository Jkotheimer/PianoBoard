#include <X11/Xlib.h>
#include <stdlib.h>
#include <stdio.h>

#include "Window.h"
#include "FontHelper.h"
#include "DrawHelper.h"

Display *init_window(Window *window) {

	BLUE printf("Opening display...\n");
	Display *display = XOpenDisplay(NULL);
	if (display == NULL) {
		fprintf(stderr, "Cannot open display\n");
		return NULL;
	}
	GREEN printf("Display is opened properly\n");

	int screen_num = DefaultScreen(display);

	*window = XCreateSimpleWindow(display, RootWindow(display, screen_num), 0, 0, WIN_W, WIN_H, screen_num, GREY, CREAM);

	XSelectInput(display, *window, ExposureMask | ButtonPressMask | PointerMotionMask);
	NC printf("Event listeners set\n");

	XMapWindow(display, *window);

	return display;
}

int event_loop(Window window, Display *display) {

	int screen_num = DefaultScreen(display);
	char hovering = '\0';
	XEvent e;

	GREEN printf("Listening for events...\n\n");
	NC

	while(1) {

		XNextEvent(display, &e);


		if (e.type == Expose) {
			draw_gui(display, window, screen_num);
			position_window(display, window, screen_num);
		}
		if (e.type == MotionNotify) {
			XMotionEvent mouse = e.xmotion;
			if(mouse_over (mouse.x, mouse.y, J_BUTTON_X)) {
				hovering = 'J';
			}
			else if(mouse_over(mouse.x, mouse.y, P_BUTTON_X)) {
				hovering = 'P';
			}
			else if(mouse_over(mouse.x, mouse.y, N_BUTTON_X)) {
				hovering = 'N';
			}
			else {
				hovering = '\0';
			}
		}
		if (e.type == ButtonPress) {
			XButtonEvent click = e.xbutton;

			if(mouse_over(click.x, click.y, J_BUTTON_X)) {
				GREEN printf("Java implementation selected\n\n");
				NC
				system(J_COMMAND);
				return 0;
			}
			else if(mouse_over(click.x, click.y, P_BUTTON_X)) {
				GREEN printf("Python implementation selected\n\n");
				NC
				system(P_COMMAND);
				return 0;
			}
			else if(mouse_over(click.x, click.y, N_BUTTON_X)) {
				GREEN printf("Node.js implemenation selected\n\n");
				NC
				system(N_COMMAND);
				return 0;
			}
		}
	}
	return -1;
}

// Position the window in the center of the display
void position_window(Display *display, Window window, int screen_num) {

	int WIN_X = (DisplayWidth (display, screen_num)/2) - (WIN_W/2);
	int WIN_Y = (DisplayHeight (display, screen_num)/2) - WIN_H;
	XMoveWindow(display, window, WIN_X, WIN_Y);
	XSync(display, 0);
}

// Determine if the mouse is currently over a specific button
int mouse_over(int x, int y, int button_x) {

	if (x > button_x && x < (button_x + BUTTON_W) &&
		y > BUTTON_Y &&	y < (BUTTON_Y + BUTTON_H)) {
		return 1;
	}
	else {
		return 0;
	}
}

