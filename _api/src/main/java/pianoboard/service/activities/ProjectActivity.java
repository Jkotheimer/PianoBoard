package pianoboard.service.activities;

import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;

import pianoboard.domain.project.*;
import pianoboard.service.representations.*;
import pianoboard.resources.Resources;

/**
 * <ProjectActivity>
 * - Converts Project objects into ProjectRepresentations
 * - Adds HATEOAS links to ProjectRepresentations for client use
 *
 * All documentation comments above method declarations are meant to explain the less than obvious decisions made in the creation of this system
 * Created by Jack Kotheimer
 *
 */
public class ProjectActivity {

	private ProjectManager manager = new ProjectManager();

	/**
	 * Retrieve all project names that belong to the given user
	 *
	 * @return <Map> : A map pointing from project names to get links for the client to retrieve the whole project
	 * @throws IOException : When the provided username does not exist within the database or the filenames could not be read
	 */
	public Map<String, String> getAll(String username) throws IOException {
		List<String> projectNames =  manager.getAll(username);
		Map<String, String> nameLinks = new HashMap<String, String>();

		for(String name : projectNames)
			nameLinks.put(name, Resources.rootURL + "/" + username + "/projects/" + name);

		return nameLinks;
	}

	/**
	 * Get the specified project from the database and convert it into a representation to return to the client
	 *
	 * @throws IOException : When the username or projectName do not exist within the database
	 * @throws JsonProcessingException : When the data read from the database cannot be parsed into a ProjectRepresentation
	 */
	public ProjectRepresentation get(String username, String projectName) throws IOException, JsonProcessingException {
		return setLinks(
			new ProjectRepresentation(
				manager.get(username, projectName)
			)
		);
	}

	/**
	 * Create a new project for the given user with the specified project name
	 *
	 * @throws IOException : When the username does not exist within the database
	 * @throws JsonProcessingException : When something goes wrong stringifying the Project object that gets created in the manager
	 */
	public ProjectRepresentation create(String username, String projectName) throws IOException, JsonProcessingException {
		return setLinks(
			new ProjectRepresentation(
				manager.create(username, projectName)
			)
		);
	}

	/**
	 * Update the given project with the provided data
	 *
	 * @param action <String> : the action that the client chose to perform in the update
	 * @param data <String> : the data sent by the client to pass to the respective action method
	 * @throws IOException : When the username or projectName does not exist within the database
	 * @throws JsonProcessingException : When the project JSON file could not be parsed into a Project object
	 */
	public ProjectRepresentation update(String username, String projectName, String action, String data) throws IOException, JsonProcessingException {
		Project p = manager.get(username, projectName);
		switch(action) {
			case "name" :				p.setName(data);					break;
			case "genre" :				p.setGenre(data);					break;
			case "time_signature" :		p.setTimeSig(data);					break;
			case "tempo" :				p.setTempo(Integer.parseInt(data));	break;
			case "collaborators" :		p.addCollaborator(data);			break;
			case "tracks" :				p.addTrack();						break;
		}
		manager.update(username, projectName, p);
		return setLinks(new ProjectRepresentation(p));
	}

	/**
	 * TODO Implement this
	 */
	public ProjectRepresentation addRecording(String username, String projectName, String trackID, String recording) throws IOException, JsonProcessingException {
		return new ProjectRepresentation();
	}

	/**
	 * Delete the given project (See other methods for purpose of thrown exceptions)
	 */
	public void delete(String username, String projectName) throws IOException {
		manager.delete(username, projectName);
	}

	/**
	 * Set the HATEOAS links for the given project representation
	 * Each link maps to a different function within this activity class
	 */
	private ProjectRepresentation setLinks(ProjectRepresentation p) {
		Map<String, String> links = new HashMap<String, String>() {{
			put("setName", Resources.rootURL + "/" + p.getUsername() + "/projects/" + p.getName() + "/name");
			put("setGenre", Resources.rootURL + "/" + p.getUsername() + "/projects/" + p.getName() + "/genre");
			put("setTimeSig", Resources.rootURL + "/" + p.getUsername() + "/projects/" + p.getName() + "/time_signature");
			put("setTempo", Resources.rootURL + "/" + p.getUsername() + "/projects/" + p.getName() + "/tempo");
			put("addCollaborator", Resources.rootURL + "/" + p.getUsername() + "/projects/" + p.getName() + "/collaborators");
			put("addTrack", Resources.rootURL +"/" + p.getUsername() + "/projects/" + p.getName() + "/tracks");
			put("delete", Resources.rootURL +"/" + p.getUsername() + "/projects/" + p.getName());
		}};
		p.setLinks(links);
		return p;
	}
}
