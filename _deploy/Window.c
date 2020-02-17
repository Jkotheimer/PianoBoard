#include <X11/Xlib.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

#include "Window.h"
#include "FontHandler.h"

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

	XSelectInput(display, *window, ExposureMask | ButtonPressMask);
	NC printf("Event listeners set\n");

	XMapWindow(display, *window);

	return display;
}

int event_loop(Window window, Display *display) {

	int screen_num = DefaultScreen(display);
	XEvent e;

	BLUE printf("Listening for events...\n\n");
	NC

	while(1) {

		XNextEvent(display, &e);

		position_window(display, window, screen_num);

		if (e.type == Expose) {
			draw_gui(display, window, screen_num);
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

/**
 * Draw the GUI
 * - Find a system scalable font
 * - Display the text prompt
 * - Draw the 3 buttons
 */
void draw_gui(Display *display, Window window, int screen_num) {

	// Iterate through the available fonts and find one that is scalable
	int count = 54;
	char** fontlist = XListFonts(display, "-*-*-*-*-*-*-*-*-*-*-*-*-iso8859-1", 1000, &count);
	char* font_name;
	for(int i = 0; i < 54; i++) {
		if(isScalableFont(fontlist[i])) {
			font_name = fontlist[i];
			break;
		}
	}
	XFontStruct *fontinfo = LoadQueryScalableFont(display, screen_num, font_name, MSG_SIZE);

	// Display the text prompt
	XGCValues gr_values;
    gr_values.font = fontinfo->fid;
    gr_values.foreground = GREY;
    gr_values.background = 0xFFFFFF;

	XDrawImageString(display, window,
					 XCreateGC(display, window, GCFont | GCForeground | GCBackground, &gr_values),
					 MSG_X, MSG_Y, MSG, strlen(MSG)
					);

	//Draw the buttons
	XSetForeground(display, DefaultGC(display, screen_num), PURPLE);
	XFillRectangle(display, window, DefaultGC(display, screen_num), J_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XFillRectangle(display, window, DefaultGC(display, screen_num), P_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XFillRectangle(display, window, DefaultGC(display, screen_num), N_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);

	XSetForeground(display, DefaultGC(display, screen_num), GREY);
	XDrawRectangle(display, window, DefaultGC(display, screen_num), J_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XDrawRectangle(display, window, DefaultGC(display, screen_num), P_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XDrawRectangle(display, window, DefaultGC(display, screen_num), N_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);

	fontinfo = LoadQueryScalableFont(display, screen_num, font_name, LABEL_SIZE);
	gr_values.font = fontinfo->fid;
	gr_values.background = PURPLE;
	XDrawImageString(display, window,
					 XCreateGC(display, window, GCFont | GCForeground | GCBackground, &gr_values),
					 JLX, LABEL_Y, J_LABEL, strlen(J_LABEL)
					);

	XDrawImageString(display, window,
					 XCreateGC(display, window, GCFont | GCForeground | GCBackground, &gr_values),
					 PLX, LABEL_Y, P_LABEL, strlen(P_LABEL)
					);

	XDrawImageString(display, window,
					 XCreateGC(display, window, GCFont | GCForeground | GCBackground, &gr_values),
					 NLX, LABEL_Y, N_LABEL, strlen(N_LABEL)
					);
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

