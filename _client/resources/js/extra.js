// This file is to execute any preliminary instructions after dynamically grabbing a new HTML
// element. These elements don't exist yet, so that's why we hold this on the server until they do

function load_project_init() { focus_on(document.getElementById('project_name_input')); }
