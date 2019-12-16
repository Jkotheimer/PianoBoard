package pianoboard.service.Representations;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import pianoboard.domain.project.Recording;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class RecordingRepresentation extends Recording {

	private Map<String, String> links;

	public RecordingRepresentation(Recording r) {
		this.start = r.getStart();
		this.end = r.getEnd();
		this.notes = r.getNotes();
		links = new HashMap<String, String>();
	}

	public List<RecordingRepresentation> makeList(List<Recording> recordings) {
		List<RecordingRepresentation> reps = new ArrayList<>();
		for(Recording r : recordings) reps.add(new RecordingRepresentation(r));

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
	 * SETTER
	 * ________________________________________________________________________
	 */

	public void setLinks(Map<String, String> links) {
		this.links = links;
	}
}
