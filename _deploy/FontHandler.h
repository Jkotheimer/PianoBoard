#include <X11/Xlib.h>

int isScalableFont(char* name);
XFontStruct *LoadQueryScalableFont(Display *display, int screen, char* name, int size);
