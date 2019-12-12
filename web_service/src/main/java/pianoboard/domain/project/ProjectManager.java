package pianoboard.domain.project;

import pianoboard.data_access.project.Project_Data_Accessor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;
import java.util.ArrayList;

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
	 * getAll
	 * 
	 * - Retrieve all projects from the database as a List of json strings
	 * - Cram all of the json strings into one json string containing all 
	 */
	public String getAll() {
		List<String> allProjects = database.get();
		String value = "{";
		for(int i = 0; i < (allProjects.size() - 1); i++) value += allProjects.get(i) + ",";
		value += allProjects.get(allProjects.size() - 1) + "}";
		return value;
	}
	
	public String get(String ID) {
		return mapper.writeValueAsString(new Project(ID, "user51324", "project 1"));//mapper.readValue(database.get(ID), Project.class);
	}
	
	public int post(String userID, String name) throws com.fasterxml.jackson.core.JsonProcessingException {
		// TODO: generate a unique ID
		String ID = "tempID";
		return database.post(userID, ID, mapper.writeValueAsString(new Project(ID, userID, name)));
	}
	
	public int put(String userID, String projectJson) throws JsonProcessingException {
		Project proj = mapper.readValue(projectJson, Project.class);
		return database.put(userID, proj.getID(), projectJson);
	}
	
	public int delete(String ID) {
		return database.delete(ID);
	}
}
