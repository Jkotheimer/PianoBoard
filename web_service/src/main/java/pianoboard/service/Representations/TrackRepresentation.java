package pianoboard.service.Representations;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import pianoboard.domain.project.Track;
import pianoboard.resources.Resources;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class TrackRepresentation extends Track {

	private Map<String, String> links;
	private List<RecordingRepresentation> recordings;

	public TrackRepresentation() {}

	public TrackRepresentation(Track t, String userID, String projectName) {
		setName(t.getName());
		setInstrument(t.getInstrument());
		setVolume(t.getVolume());
		setPan(t.getPan());
		setMute(t.isMuted());
		setSolo(t.isSolo());
		this.recordings = RecordingRepresentation.makeList(t.getRecordings(), userID, projectName, Integer.toString(t.getID()));
		setLinks(userID, projectName, Integer.toString(t.getID()));
	}

	public static List<TrackRepresentation> makeList(List<Track> tracks, String userID, String projectName) {
		List<TrackRepresentation> reps = new ArrayList<>();
		for(Track t : tracks) reps.add(new TrackRepresentation(t, userID, projectName));

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

	public void setLinks(String userID, String projectName, String trackID) {
		links = new HashMap<String, String>() {{
			put("setName", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + trackID + "?action=setName");
			put("setInstrument", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + trackID + "?action=setInstrument");
			put("setVolume", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + trackID + "?action=setVolume");
			put("setPan", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + trackID + "?action=setPan");
			put("setMute", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + trackID + "?action=setMute");
			put("setSolo", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + trackID + "?action=setSolo");
			put("addRecording", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + trackID);
			put("delete", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + trackID);
		}};
	}

}
