package pianoboard.domain.project;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

public class Project {

	private String ID;
	private String username;
	private String name;
	private String genre;
	private String timeSig;
	private int tempo;
	private List<String> collaborators;
	private List<Track> tracks;
	private int trackNum;

	public Project() {
		this.collaborators = new ArrayList<String>();
		this.trackNum = 1;
		this.tracks = Arrays.asList(new Track(trackNum, "Track 1"));
		setDefaults();
	}

	public Project(String ID, String username, String name) {
		this.ID = ID;
		this.username = username;
		this.name = name;
		this.collaborators = new ArrayList<String>();
		this.trackNum = 1;
		this.tracks = Arrays.asList(new Track(this.trackNum, "Track 1"));
		setDefaults();
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public String getID() {
		return this.ID;
	}

	public String getUsername() {
		return this.username;
	}

	public String getName() {
		return this.name;
	}

	public String getGenre() {
		return this.genre;
	}

	public String getTimeSig() {
		return this.timeSig;
	}

	public int getTempo() {
		return this.tempo;
	}

	public Track getTrack(int index) {
		return this.tracks.get(index);
	}

	public List<Track> getTracks() {
		return this.tracks;
	}

	public List<String> getCollaborators() {
		return this.collaborators;
	}

	public boolean hasCollaborator(String ID) {
		return this.collaborators.contains(ID);
	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setID(String ID) {
		this.ID = ID;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public void setTimeSig(String timeSig) {
		this.timeSig = timeSig;
	}

	public void setTempo(int tempo) {
		this.tempo = tempo;
	}

	public void addTrack() {
		this.trackNum++;
		this.tracks.add(new Track(this.trackNum, "Track " + Integer.toString(this.trackNum)));
	}

	public void addCollaborator(String ID) {
		this.collaborators.add(ID);
	}

	public void setCollaborators(List<String> collaborators) {
		this.collaborators = collaborators;
	}

	public void setDefaults() {
		this.genre = "";
		this.timeSig = "4/4";
		this.tempo = 120;
	}

	/**
	 * GENERAL METHODS
	 */
}
