#include <X11/Xlib.h>

// Console colors
#define BLUE printf("\033[0;34m");
#define GREEN printf("\033[0;32m");
#define RED printf("\033[0;31m");
#define NC printf("\033[0m");

// Window colors
#define YELLOW 0xFFFA99
#define PURPLE 0xD1BAED
#define CREAM 0xFFFFEF
#define GREY 0x393939
#define LIGHTGREY 0x696969

// Window dimensions
#define WIN_W 700
#define WIN_H 200

// Generic button dimensions
#define BUTTON_W 200
#define BUTTON_H 50
#define BUTTON_Y (WIN_H - BUTTON_H - 25)

// Specific button dimensions
#define J_BUTTON_X 25
#define P_BUTTON_X (J_BUTTON_X + BUTTON_W + 25)
#define N_BUTTON_X (P_BUTTON_X + BUTTON_W + 25)

// Specific button commands
#define J_COMMAND "sh ../_api/java_api/deploy.sh"
#define P_COMMAND "python3 ../_api/python_api/app.py"
#define N_COMMAND "node ../_api/node.js_api/app.js"

// Message dimensions
#define MSG_SIZE 175
#define MSG_X ((WIN_W/2) - (MSG_SIZE*2) + 25)
#define MSG_Y 75

Display *init_window(Window *w);
int event_loop(Window w, Display *d);
void position_window(Display *d, Window w, int s);
void draw_gui(Display *d, Window w, int s);
int mouse_over(int x, int y, int button_x);
