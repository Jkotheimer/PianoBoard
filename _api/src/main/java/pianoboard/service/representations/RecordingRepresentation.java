package pianoboard.service.representations;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import pianoboard.domain.project.Recording;
import pianoboard.resources.Resources;

public class RecordingRepresentation extends Recording {

	private Map<String, String> links;

	public RecordingRepresentation() {}

	public RecordingRepresentation(Recording r, String username, String projectName, String trackID) {
		setID(r.getID());
		setStart(r.getStart());
		setEnd(r.getEnd());
		setNotes(r.getNotes());
		setLinks(username, projectName, trackID, Integer.toString(r.getID()));
	}

	public static List<RecordingRepresentation> makeList(List<Recording> recordings, String username, String projectName, String trackID) {
		List<RecordingRepresentation> reps = new ArrayList<>();
		for(Recording r : recordings) reps.add(new RecordingRepresentation(r, username, projectName, trackID));

		return reps;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public Map<String, String> getLinks() {
		return this.links;
	}

	/**
	 * SETTER
	 * ________________________________________________________________________
	 */

	public void setLinks(String username, String projectName, String trackID, String recordingID) {
		this.links = new HashMap<String, String>() {{
			put("move", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "/" + recordingID + "?action=move");
			put("addNotes", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "/" + recordingID + "?action=addNotes");
			put("setNotes", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "/" + recordingID + "?action=setNotes");
			put("delete", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "/" + recordingID);
		}};
	}
}
