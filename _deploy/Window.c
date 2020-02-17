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

	XSelectInput(display, *window, ExposureMask | ButtonPressMask | PointerMotionMask);
	NC printf("Event listeners set\n");

	XMapWindow(display, *window);

	return display;
}

int event_loop(Window window, Display *display) {

	int screen_num = DefaultScreen(display);
	char hovering = '\0';
	XEvent e;

	BLUE printf("Listening for events...\n\n");
	NC

	while(1) {

		XNextEvent(display, &e);

		position_window(display, window, screen_num);

		if (e.type == Expose) {
			draw_gui(display, window, screen_num);
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

/**
 * Draw the GUI
 * - Find a system scalable font
 * - Display the text prompt
 * - Draw the 3 buttons
 */
void draw_gui(Display *display, Window window, int screen_num) {

	XGCValues font = set_font(display, MSG_SIZE, GREY, WHITE);
	NC printf("Drawing prompt string...\n");
	draw_string(display, window, MSG, MSG_X, MSG_Y, font);
	printf("Prompt string drawn\n");

	printf("Drawing buttons...\n");
	draw_button(display, window, 'J', PURPLE, GREY);
	draw_button(display, window, 'P', PURPLE, GREY);
	draw_button(display, window, 'N', PURPLE, GREY);
	printf("Buttons drawn\n");
}

// Draw either the J, P, or N button in the specified color and border color
void draw_button(Display *display, Window window, char button, long color, long border_color) {

	int button_x = 0;
	int label_x = 0;
	char* label = "\0";
	if(button == 'J') {
		button_x = J_BUTTON_X;
		label_x = JLX;
		label = J_LABEL;
	}
	else if(button == 'P') {
		button_x = P_BUTTON_X;
		label_x = PLX;
		label = P_LABEL;
	}
	else if(button == 'N') {
		button_x = N_BUTTON_X;
		label_x = NLX;
		label = N_LABEL;
	}
	else return;

	draw_rectangle(display, window, button_x, BUTTON_Y, color, border_color);
	draw_string(display, window, label, label_x, LABEL_Y, set_font(display, LABEL_SIZE, border_color, color));

}

// Draw the given message at the provided x,y coordinates in the specified font
void draw_string(Display *display, Window window, char* msg, int x, int y, XGCValues font) {

	XDrawImageString(display, window,
					 XCreateGC(display, window, GCFont | GCForeground | GCBackground, &font),
					 x, y, msg, strlen(msg)
					);
}

// Draw a rectangle at the given x,y coordinates with the provided color and border color
void draw_rectangle(Display *display, Window window, int x, int y, long color, long border_color) {

	XSetForeground(display, DefaultGC(display, DefaultScreen(display)), color);
	XFillRectangle(display, window, DefaultGC(display, DefaultScreen(display)), x, y, BUTTON_W, BUTTON_H);
	XSetForeground(display, DefaultGC(display, DefaultScreen(display)), border_color);
	XDrawRectangle (display, window, DefaultGC(display, DefaultScreen(display)), x, y, BUTTON_W, BUTTON_H);
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

