#include <X11/Xlib.h>
#include <stdio.h>

#include "FontHandler.h"

int isScalableFont(char *name) {
    int i, field;

    if ((name == NULL) || (name[0] != '-')) return 0;

    for(i = field = 0; name[i] != '\0' && field <= 14; i++) {
		if (name[i] == '-') {
	    	field++;
	    	if ((field == 7) || (field == 8) || (field == 12))
			if ((name[i+1] != '0') || (name[i+2] != '-'))
				return 0;
		}
    }

    if (field != 14) return 0;
    else return 1;
}

XFontStruct *LoadQueryScalableFont(Display *display, int screen, char* name, int size) {
    int i,j, field;
    char newname[500];    /* big enough for a long font name */
    int res_x, res_y;     /* resolution values for this screen */
    /* catch obvious errors */
    if ((name == NULL) || (name[0] != '-')) return NULL;
    /* calculate our screen resolution in dots per inch. 25.4mm = 1 inch */
    res_x = DisplayWidth(display, screen)/(DisplayWidthMM(display, screen)/25.4);
    res_y = DisplayHeight(display, screen)/(DisplayHeightMM(display, screen)/25.4);
    /* copy the font name, changing the scalable fields as we do so */
    for(i = j = field = 0; name[i] != '\0' && field <= 14; i++) {
        newname[j++] = name[i];
        if (name[i] == '-') {
            field++;
            switch(field) {
            case 7:  /* pixel size */
            case 12: /* average width */
                /* change from "-0-" to "-*-" */
                newname[j] = '*';
                j++;
                if (name[i+1] != '\0') i++;
                break;
            case 8:  /* point size */
                /* change from "-0-" to "-<size>-" */
                sprintf(&newname[j], "%d", size);
                while (newname[j] != '\0') j++;
                if (name[i+1] != '\0') i++;
                break;
            case 9:  /* x-resolution */
            case 10: /* y-resolution */
                /* change from an unspecified resolution to res_x or res_y */
                sprintf(&newname[j], "%d", (field == 9) ? res_x : res_y);
                while(newname[j] != '\0') j++;
                while((name[i+1] != '-') && (name[i+1] != '\0')) i++;
                break;
            }
        }
    }
    newname[j] = '\0';
    /* if there aren't 14 hyphens, it isn't a well formed name */
    if (field != 14) return NULL;
    return XLoadQueryFont(display, newname);
}
