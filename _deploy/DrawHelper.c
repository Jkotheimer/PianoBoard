#include <X11/Xlib.h>
#include <string.h>

#include "Window.h"
#include "FontHelper.h"
#include "DrawHelper.h"

/**
 * Draw the GUI
 * - Find a system scalable font
 * - Display the text prompt
 * - Draw the 3 buttons
 */
void draw_gui(Display *display, Window window, int screen_num) {

	XGCValues font = set_font(display, MSG_SIZE, GREY, WHITE);
	draw_string(display, window, MSG, MSG_X, MSG_Y, font);

	draw_button(display, window, 'J', PURPLE, GREY);
	draw_button(display, window, 'P', PURPLE, GREY);
	draw_button(display, window, 'N', PURPLE, GREY);
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
