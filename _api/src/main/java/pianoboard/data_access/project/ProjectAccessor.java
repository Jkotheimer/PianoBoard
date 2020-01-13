package pianoboard.data_access.project;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

/**
 * Project_Data_Accessor class
 *
 * This class will be used to create, read, update, and delete
 * project resourcesfrom the database using jsondb
 */
//@Document(collection = "")
public class ProjectAccessor {

	public ProjectAccessor() {}

	/**
	 * CRUD METHODS
	 * ________________________________________________________________________
	 */

	/**
	 * Get the namess of all of the projects owned by the given username
	 */
	public List<String> getAll(String username) throws IOException {

		// Check the database for an account with the given username. If it doesn't exist, throw an exception
		validateUser(username);

		// Return the names of all of the project files in the directory
		File f = new File("pianoboard/database/" + username + "/projects/");
		return Arrays.asList(f.list());
	}

	/**
	 * Return the whole project denoted by the given username and project ID number
	 */
	public String get(String username, String projectName) throws IOException {

		// Check the database for an account with the given username. If it doesn't exist, throw an exception
		validateUser(username);

		// Check for a project with the given name in the users directory
		File f = new File("pianoboard/database/" + username + "/projects/" + projectName + ".json");
		if(!f.exists()) throw new IOException(username + " does not have a project with name " + projectName);

		// Return the contents of the file
		return Files.readString(f.toPath());
	}

	public void create(String username, String projectName, String projectJSON) throws IOException {

		// Check the database for a user with the given username. If one does not exist, an IOException will be thrown
		validateUser(username);

		// Check for a project that already has the given name
		File f = new File("pianoboard/database/" + username + "/projects/" + projectName + ".json");
		if(!f.createNewFile()) throw new IOException(username + " already has a project called " + projectName);

		// Write the json string to the file
		Files.writeString(f.toPath(), projectJSON);
	}

	public void update(String username, String projectName, String projectJSON) throws IOException {

		// Check the database for a user with the given username. If one does not exist, an IOException will be thrown
		validateUser(username);

		// Check for a project that already has the given name
		File f = new File("pianoboard/database/" + username + "/projects/" + projectName + ".json");
		if(!f.exists()) throw new IOException(username + " does not have a project called " + projectName);

		// Write the json string to the file
		Files.writeString(f.toPath(), projectJSON);
	}

	public void delete(String username, String projectName) throws IOException {

		// Check the database to ensure the username exists, if not, throw IOException
		validateUser(username);

		File f = new File("pianoboard/database/" + username + "/projects/" + projectName + ".json");
		if(!f.exists()) throw new IOException(username + " does not currently have a project called " + projectName);

		// Delete the file
		Files.delete(f.toPath());
	}

	private void validateUser(String username) throws IOException {
		File f = new File("pianoboard/database/" + username + "/");
		if(!f.exists()) throw new IOException("Account with username " + username + " does not exist");
	}
}
