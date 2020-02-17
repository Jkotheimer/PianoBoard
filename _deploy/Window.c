#include <X11/Xlib.h>
#include <string.h>
#include <stdio.h>

#include "Window.h"
#include "FontHandler.h"

Display *init_window(Window *window) {

	BLUE
	printf("Opening display...\n");
	Display *display = XOpenDisplay(NULL);
	if (display == NULL) {
		fprintf(stderr, "Cannot open display\n");
		return NULL;
	}
	GREEN
	printf("Display is opened properly\n");

	int screen_num = DefaultScreen(display);

	// We need the width of the display to determine the WIN_X value
	XWindowAttributes attribute;
	XGetWindowAttributes(display, *window, &attribute);
	int WIN_X = (attribute.width/2) - (WIN_W/2);

	*window = XCreateSimpleWindow(display, RootWindow(display, screen_num), WIN_X, WIN_Y, WIN_W, WIN_H, screen_num, GREY, CREAM);
	NC
	printf("Window instantiated\n");
	XSelectInput(display, *window, ExposureMask | ButtonPressMask);
	printf("Event listeners set\n");
	XMapWindow(display, *window);

	return display;
}

int event_loop(Window window, Display *display) {

	int screen_num = DefaultScreen(display);
	XEvent e;

	BLUE
	printf("Listening for events...\n\n");
	NC

	while(1) {
		XNextEvent(display, &e);
		if (e.type == Expose) {
			draw_gui(display, window, screen_num);
		}
		if (e.type == ButtonPress || e.type == ButtonRelease) {
			XButtonEvent click = e.xbutton;

			if(clicked(click.x, click.y, J_BUTTON_X)) {
				GREEN
				printf("Java implementation selected\n\n");
				NC
				system(J_COMMAND);
				return 0;
			}
			else if(clicked(click.x, click.y, P_BUTTON_X)) {
				GREEN
				printf("Python implementation selected\n\n");
				NC
				system(P_COMMAND);
				return 0;
			}
			else if(clicked(click.x, click.y, N_BUTTON_X)) {
				GREEN
				printf("Node.js implemenation selected\n\n");
				NC
				system(N_COMMAND);
				return 0;
			}
		}
	}
	return 0;
}

void draw_gui(Display *display, Window window, int screen_num) {

	int count = 10;
	char** fontlist = XListFonts(display, "-*-*-*-*-*-*-*-*-*-*-*-*-iso8859-1", 1000, &count);
	char* font_name;
	for(int i = 0; i < 54; i++) {
		if(isScalableFont(fontlist[i])) {
			printf("%s is scalable\n\n", fontlist[i]);
			font_name = fontlist[i];
			break;
		}
	}

	char *msg = "With which tool would you like to deploy PianoBoard?";

	printf("Loading font...\n");
	XFontStruct *fontinfo = LoadQueryScalableFont(display, screen_num, font_name, MSG_SIZE);
	printf("%d\n%d\n\n", fontinfo->ascent, fontinfo->descent);
	XGCValues gr_values;
    gr_values.font = fontinfo->fid;
    gr_values.foreground = GREY;
    gr_values.background = 0xFFFFFF;
	//gr_values.line_width = 1;
    GC gr_context1 = XCreateGC(display, window, GCFont | GCForeground | GCBackground, &gr_values);
	printf("Drawing String...\n");
	XDrawImageString(display, window, gr_context1, MSG_X, MSG_Y, msg, strlen(msg));
	printf("String drawn\n");

	XSetForeground(display, DefaultGC(display, screen_num), PURPLE);
	XFillRectangle(display, window, DefaultGC(display, screen_num), J_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XFillRectangle(display, window, DefaultGC(display, screen_num), P_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XFillRectangle(display, window, DefaultGC(display, screen_num), N_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);

	XSetForeground(display, DefaultGC(display, screen_num), GREY);
	XDrawRectangle(display, window, DefaultGC(display, screen_num), J_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XDrawRectangle(display, window, DefaultGC(display, screen_num), P_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
	XDrawRectangle(display, window, DefaultGC(display, screen_num), N_BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H);
}

int clicked(int x, int y, int button_x) {
	if (x > button_x && x < (button_x + BUTTON_W) &&
		y > BUTTON_Y &&	y < (BUTTON_Y + BUTTON_H)) {
		return 1;
	}
	else {
		return 0;
	}
}

