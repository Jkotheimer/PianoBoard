.PHONY: clean compile
.DEFAULT_GOAL := run

CC = gcc
XLIB = -lX11
DEP = -L/usr/X11R6/lib
EXE = myWindow

run: clean compile
	./${EXE}

clean:
	@echo "Cleaning up..."
	rm ${EXE}
	@echo "--Build directory clean--"

compile:
	@echo "Compiling source..."
	${CC} window.c ${XLIB} -o ${EXE}
	@echo "--Source compiled--"

