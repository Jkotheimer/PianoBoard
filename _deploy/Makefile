.PHONY: clean compile end run build
.DEFAULT_GOAL := build

# BUILD VARIABLES
CC = gcc
XLIB = -lX11
FLAG = -I.
EXE = Deploy

# COLORS
RED = "\033[0;31m"
GREEN = "\033[0;32m"
BLUE = "\033[0;34m"
NC = "\033[0m"

build: clean compile

run: build
	@./${EXE}

# Clean out any previously built modules
clean:
	$(call print, ${BLUE}, "Cleaning up...")
	
	@touch ${EXE}
	rm ${EXE}
	
	$(call print, ${GREEN}, "Build directory clean")
	$(call end)

# Compile the source
compile: %.c %.h
	$(call print, ${BLUE}, "Compiling source...")
	
	${CC} ${FLAG} %.c ${XLIB} -o ${EXE}
	
	$(call print, ${GREEN}, "Source compiled")
	$(call end)

# Print the given string ${2} in the provided color ${1} then CRLF, and finally reset the color to default
define print
	@printf ${1}
	@printf ${2}
	@printf "\n"
	@printf ${NC}
endef

# Print a bar across the terminal in the default terminal color to signify the end of a goal
define end
	@printf ${NC}
	@printf "_____________________________________________________\n\n"
endef
