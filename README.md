# PianoBoard

Pianoboard is a web application that allows users to create music projects under which they may record MIDI tracks.

- The web pages are dynamically rendered with PHP.
- All API logic is implemented in Node.js.
- The database is implemented as a MySQL server.


## Full API Documentation

![API Documentation](https://github.com/Jkotheimer/PianoBoard/blob/master/_api/API_documentation.png)

## For Developers

To run this project locally, run `./run.sh` from the project root directory. This script does the following:
- Ensures that you have MySQL installed on your machine (if not, it will exit and ask you to install it)
- Creates a `_dependencies/` folder in the project root directory
- Downloads and installs Apache HTTPD and any necessary dependencies into the `_dependencies/` folder
- Downloads and installs PHP7 into the `_dependencies/` folder
- Ensures Node is installed on your machine
- Installs all npm dependencies in the `_api/` folder
- Configures all of the above to work together and set the `_client/` folder as the document root
- Starts up the HTTPD server on your machine
- Starts up the Node.js servlet

You may run `./run.sh --help` to view all sub-commands if you wish to reset any settings as you develop.
