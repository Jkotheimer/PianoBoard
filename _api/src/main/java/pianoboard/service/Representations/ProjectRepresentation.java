package pianoboard.service.Representations;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import pianoboard.domain.project.Project;
import pianoboard.resources.Resources;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ProjectRepresentation extends Project {

	private Map<String, String> links;
	private List<TrackRepresentation> tracks;

	public ProjectRepresentation() {}

	public ProjectRepresentation(Project p) {
		setID(p.getID());
		setUsername(p.getUsername());
		setName(p.getName());
		setGenre(p.getGenre());
		setTimeSig(p.getTimeSig());
		setTempo(p.getTempo());
		setCollaborators(p.getCollaborators());
		this.tracks = TrackRepresentation.makeList(p.getTracks(), p.getUsername(), p.getName());
		links = new HashMap<String, String>();
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
}
