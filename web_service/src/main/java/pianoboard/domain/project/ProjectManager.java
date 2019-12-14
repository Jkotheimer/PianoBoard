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

	// Retrieve all projects from the database
	public List<Project> getAll(String userID) throws IOException, JsonProcessingException {
		List<Project> projectList = new ArrayList<Project>();
		List<String> all = database.getAll(userID);
		for(String p : all) projectList.add(mapper.readValue(p, Project.class));

		return projectList;
	}

	public Project get(String userID, String projectName) throws IOException, JsonProcessingException {
		mapper.readValue(database.get(userID, projectName), Project.class);
		return new Project();
	}

	public Project create(String userID, String projectName) throws IOException, JsonProcessingException {
		String ID = UUID.randomUUID().toString();
		Project p = new Project(ID, userID, projectName);
		database.create(userID, ID, mapper.writeValueAsString(p));

		return p;
	}

	public void update(String userID, String ID, Project p) throws IOException, JsonProcessingException {
		database.update(userID, ID, mapper.writeValueAsString(p));
	}

	public void delete(String userID, String ID) throws IOException {
		database.delete(userID, ID);
	}
}
