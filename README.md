# PianoBoard

Pianoboard is a web application that allows users to create music projects under which they may record MIDI tracks.

## Full API Documentation

![API Documentation](https://github.com/Jkotheimer/PianoBoard/blob/master/_api/API_documentation.png)

## Tools

1. The web pages are dynamically rendered with PHP.
2. All API logic is implemented in Node.js.
3. The database is implemented as a MySQL server.

I chose this stack for several reasons.
1. I wanted clean front-end JavaScript. I could have easily relied on the Node.js API to make AJAX calls from the client for dynamic web pages. But that would very easily dissolve into spaghetti code. PHP allowed me to return different HTML templates given different circumstances. For instance, on the landing page, if the user is logged in, return the dashboard, else return the login. Without PHP, all of that would have to be returned in one HTML file and the front-end JavaScript would have to weed out the details.
1. I've worked with Java E2EE before. I've worked with Python Flask before. Hell, I even tried to ride the Rails. A Java CXF/Tomcat servlet is complete overkill. Python Flask has far too many tools to even comprehend. And dont even get me started on Rails. Node is in it's upswing right now and it has just enough npm tools to get the job done. It also makes sense for this project - not too much data processing, just a shitload of I/O and callbacks.
1. There is nothing that compares to the sweet simplicity of a MySQL database. Mongo is fun to fiddle around with, but the whole noSQL fad is just not my cup o' tee. The relational nature of the project heirarchy makes a relational database perfect for this project.

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
