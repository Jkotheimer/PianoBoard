package pianoboard.domain.project;

import pianoboard.data_access.project.Project_Data_Accessor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;
import java.io.IOException;

/**
 * ProjectManager class
 *
 * This class will be a 2 way passage for projects
 * - Package project POJOs into .json files to be sent to the database
 * - Stringify .json files from the database to send to the client
 */
public class ProjectManager {

	private ObjectMapper mapper = new ObjectMapper();
	private Project_Data_Accessor database = new Project_Data_Accessor();

	public ProjectManager() {}

	/**
	 * CRUD METHODS
	 * ________________________________________________________________________
	 */

	/**
	 * Retrieve the names of all of the projects that belong to the given user
	 *
	 * @param username <String> : the username of the account from which to return all the project names
	 * @return <List>
	 */
	public List<String> getAll(String username) throws IOException {
		return database.getAll(username);
	}

	/**
	 * Retrieve the string value of the json file for the specified username and project ID
	 * Convert that string value into a Project object and return it
	 *
	 * @param username <String> : the username of the account that owns the project
	 * @param projectName <String> : the name of the project to search for within the users directory
	 * @return <Project> : the project object parsed from the string returned from the database
	 */
	public Project get(String username, String projectName) throws IOException, JsonProcessingException {
		return mapper.readValue(database.get(username, projectName), Project.class);
	}

	/**
	 * Create a new project from the given username and project name
	 *
	 * @param username <String> : The username under which to save the new project
	 * @param projectName <String> : The name of the project to create
	 * @return <Project> : The new project
	 */
	public Project create(String username, String projectName) throws IOException, JsonProcessingException {
		Project p = new Project(UUID.randomUUID().toString(), username, projectName);
		database.create(username, projectName, mapper.writeValueAsString(p));

		return p;
	}

	public void update(String username, String projectName, Project p) throws IOException, JsonProcessingException {
		database.update(username, projectName, mapper.writeValueAsString(p));
	}

	public void delete(String username, String projectName) throws IOException {
		database.delete(username, projectName);
	}
}
