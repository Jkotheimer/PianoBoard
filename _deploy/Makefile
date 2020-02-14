.PHONY: clean compile end
.DEFAULT_GOAL := run

CC = gcc
XLIB = -lX11
DEP = -L/usr/X11R6/lib
EXE = myWindow

# COLORS
RED = "\033[0;31m"
GREEN = "\033[0;32m"
BLUE = "\033[0;34m"
NC = "\033[0m"

run: clean compile
	@./${EXE}

clean:
	$(call print, ${BLUE}, "Cleaning up...")

	@touch ${EXE}
	rm ${EXE}

	$(call print, ${GREEN}, "Build directory clean")
	$(call end)

compile:
	$(call print, ${BLUE}, "Compiling source...")

	${CC} window.c ${XLIB} -o ${EXE}

	$(call print, ${GREEN}, "Source compiled")
	$(call end)

define print
	@printf ${1}
	@printf ${2}
	@printf "\n"
	@printf ${NC}
endef

define end
	@printf ${NC}
	@printf "_____________________________________________________\n\n"
endef
