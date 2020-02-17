#include <X11/Xlib.h>

int isScalableFont(char* name);
XFontStruct *LoadQueryScalableFont(Display *display, int screen, char* name, int size);
XGCValues set_font(Display *d, int size, long color, long background);
