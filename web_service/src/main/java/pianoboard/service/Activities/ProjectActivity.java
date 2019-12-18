package pianoboard.service.Activities;

import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;

import pianoboard.domain.project.*;
import pianoboard.service.Representations.*;
import pianoboard.resources.Resources;

public class ProjectActivity {

	private ProjectManager manager = new ProjectManager();

	public List<ProjectRepresentation> getAll(String userID) throws IOException, JsonProcessingException {
		List<Project> projects = manager.getAll(userID);
		List<ProjectRepresentation> reps = new ArrayList<>();

		for(Project p : projects)
			reps.add(setLinks(new ProjectRepresentation(p)));

		return reps;
	}

	public ProjectRepresentation get(String userID, String projectName) throws IOException, JsonProcessingException {
		return setLinks(new ProjectRepresentation(manager.get(userID, projectName)));
	}

	public ProjectRepresentation create(String userID, String projectName) throws IOException, JsonProcessingException {
		return setLinks(new ProjectRepresentation(manager.create(userID, projectName)));
	}

	public ProjectRepresentation update(String userID, String projectName, String action, String data) throws IOException, JsonProcessingException {
		Project p = manager.get(userID, projectName);
		switch(action) {
			case "setName" :			p.setName(data);					break;
			case "setGenre" :			p.setGenre(data);					break;
			case "setTimeSig" :			p.setTimeSig(data);					break;
			case "setTempo" :			p.setTempo(Integer.parseInt(data));	break;
			case "addCollaborator" :	p.addCollaborator(data);			break;
			case "addTrack" :			p.addTrack();						break;
		}
		return setLinks(new ProjectRepresentation(p));
	}

	public ProjectRepresentation addRecording(String userID, String projectName, String trackID, String recording) throws IOException, JsonProcessingException {
		return new ProjectRepresentation();
	}

	public int delete(String userID, String projectName) throws IOException, JsonProcessingException {
		return manager.delete(userID, projectName);
	}

	private ProjectRepresentation setLinks(ProjectRepresentation p) {
		Map<String, String> links = new HashMap<String, String>() {{
			put("setName", Resources.rootURL + "/" + p.getUserID() + "/projects/" + p.getName() + "?action=setName");
			put("setGenre", Resources.rootURL + "/" + p.getUserID() + "/projects/" + p.getName() + "?action=setGenre");
			put("setTimeSig", Resources.rootURL + "/" + p.getUserID() + "/projects/" + p.getName() + "?action=setTimeSig");
			put("setTempo", Resources.rootURL + "/" + p.getUserID() + "/projects/" + p.getName() + "?action=setTempo");
			put("addCollaborator", Resources.rootURL + "/" + p.getUserID() + "/projects/" + p.getName() + "?action=addCollaborator");
			put("addTrack", Resources.rootURL +"/" + p.getUserID() + "/projects/" + p.getName() + "?action=addTrack");
			put("delete", Resources.rootURL +"/" + p.getUserID() + "/projects/" + p.getName());
		}};
		p.setLinks(links);
		return p;
	}
}
