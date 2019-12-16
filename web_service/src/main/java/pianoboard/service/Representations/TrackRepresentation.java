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

	public TrackRepresentation(Track t, String userID, String projectName) {
		this.name = t.getName();
		this.instrument = t.getInstrument();
		this.volume = t.getVolume();
		this.pan = t.getPan();
		this.mute = t.isMuted()
		this.solo = t.isSolo();
		this.recordings = RecordingRepresentation.makeList(t.getRecordings(), userID, projectName);
		setLinks(userID, projectName);
	}

	public List<TrackRepresentation> makeList(List<Track> tracks, String userID, String projectName) {
		List<TrackRepresentation> reps = new ArrayList<>();
		for(Track t : tracks) reps.add(new TrackRepresentation(t, userID, projectName));

		return reps;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public Map>String, String> getLinks() {
		return this.links;
	}
	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setLinks(Map<String, String> links) {
		this.links = links;
	}

	public void setLinks(String userID, String projectName) {
		this.links = new HashMap<String, String>{{
			put("setName", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + this.name + "?action=setName");
			put("setInstrument", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + this.name + "?action=setInstrument");
			put("setVolume", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + this.name + "?action=setVolume");
			put("setPan", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + this.name + "?action=setPan");
			put("setMute", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + this.name + "?action=setMute");
			put("setSolo", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + this.name + "?action=setSolo");
			put("addRecording", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + this.name);
			put("delete", Resources.rootURL + "/" + userID + "/projects/" + projectName + "/" + this.name);
		}};
	}

}
