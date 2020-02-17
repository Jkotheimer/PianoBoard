#include <X11/Xlib.h>

void draw_gui(Display *d, Window w, int s);
void draw_button(Display *d, Window w, char button, long color, long border_color);
void draw_string(Display *d, Window w, char* msg, int x, int y, XGCValues font);
void draw_rectangle(Display *display, Window window, int x, int y, long color, long border_color);
