package pianoboard.service.representations;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import pianoboard.domain.project.Track;
import pianoboard.resources.Resources;

public class TrackRepresentation extends Track {

	private Map<String, String> links;
	private List<RecordingRepresentation> recordings;

	public TrackRepresentation() {}

	public TrackRepresentation(Track t, String username, String projectName) {
		setName(t.getName());
		setInstrument(t.getInstrument());
		setVolume(t.getVolume());
		setPan(t.getPan());
		setMute(t.isMuted());
		setSolo(t.isSolo());
		this.recordings = RecordingRepresentation.makeList(t.getRecordings(), username, projectName, Integer.toString(t.getID()));
		setLinks(username, projectName, Integer.toString(t.getID()));
	}

	public static List<TrackRepresentation> makeList(List<Track> tracks, String username, String projectName) {
		List<TrackRepresentation> reps = new ArrayList<>();
		for(Track t : tracks) reps.add(new TrackRepresentation(t, username, projectName));

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
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setLinks(Map<String, String> links) {
		this.links = links;
	}

	public void setLinks(String username, String projectName, String trackID) {
		links = new HashMap<String, String>() {{
			put("setName", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "?action=setName");
			put("setInstrument", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "?action=setInstrument");
			put("setVolume", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "?action=setVolume");
			put("setPan", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "?action=setPan");
			put("setMute", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "?action=setMute");
			put("setSolo", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID + "?action=setSolo");
			put("addRecording", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID);
			put("delete", Resources.apiURL + "/" + username + "/projects/" + projectName + "/" + trackID);
		}};
	}

}
