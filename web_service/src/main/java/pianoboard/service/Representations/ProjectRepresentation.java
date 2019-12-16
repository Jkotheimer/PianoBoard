package pianoboard.service.Representations;

import java.util.Map;
import java.util.HashMap;

import pianoboard.domain.project.Project;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ProjectRepresentation extends Project {

	private Map<String, String> links;
	private List<TrackRepresentation> tracks;

	public ProjectRepresentation(Project p) {
		this.ID = p.getID();
		this.userID = p.getUserID();
		this.name = p.getName();
		this.genre = p.getGenre();
		this.timeSig = p.getTimeSig();
		this.tempo = p.getTempo();
		this.collaborators = p.getCollaborators();
		this.tracks = TrackRepresentation.makeList(p.getTracks(), this.userID, this.name);
		links = new HashMap<String, String>();
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public List<TrackRepresentation> getTracks() {
		return this.tracks;
	}

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

	public void setTracks(List<TrackRepresentation> tracks) {
		this.tracks = tracks;
	}
}
