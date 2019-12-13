package pianoboard.domain.project;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

public class Project {
	
	private String ID;
	private String userID;
	private String name;
	private String genre;
	private String timeSig;
	private int tempo;
	private List<String> collaboratorIDs;
	private List<Track> tracks;
	
	public Project() {
		this.collaboratorIDs = new ArrayList<String>();
		this.tracks = Arrays.asList(new Track("Track 1"));
		setDefaults();
	}
	
	public Project(String ID, String userID, String name) {
		this.ID = ID;
		this.userID = userID;
		this.name = name;
		this.collaboratorIDs = new ArrayList<String>();
		this.tracks = Arrays.asList(new Track("Track 1"));
		setDefaults();
	}
	
	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	
	public String getID() {
		return this.ID;
	}
	
	public String getUserID() {
		return this.userID;
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
		return this.collaboratorIDs;
	}
	
	public boolean hasCollaborator(String ID) {
		return this.collaboratorIDs.contains(ID);
	}
	
	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	
	public void setID(String ID) {
		this.ID = ID;
	}
	
	public void setUserID(String userID) {
		this.userID = userID;
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
		this.tracks.add(new Track("Track " + (this.tracks.size() + 1)));
	}
	
	public void addCollaborator(String ID) {
		this.collaboratorIDs.add(ID);
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
