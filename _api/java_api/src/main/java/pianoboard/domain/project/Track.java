package pianoboard.domain.project;

import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

public class Track {

	private List<Recording> recordings;
	private String name;
	private int ID;
	private String instrument;
	private int volume;
	private int pan;
	private boolean mute;
	private boolean solo;
	private int recordingNum;

	public Track() {}

	public Track(int ID, String name) {
		this.ID = ID;
		this.name = name;
		this.recordings = new ArrayList<Recording>();
		setDefaultSettings();
		this.recordingNum = 0;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public List<Recording> getRecordings() {
		return this.recordings;
	}

	public Recording getRecording(int index) {
		return this.recordings.get(index);
	}

	public int getID() {
		return this.ID;
	}

	public String getName() {
		return this.name;
	}

	public String getInstrument() {
		return this.instrument;
	}

	public int getVolume() {
		return this.volume;
	}

	public int getPan() {
		return this.pan;
	}

	public boolean isMuted() {
		return this.mute;
	}

	public boolean isSolo() {
		return this.solo;
	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setID(int ID) {
		this.ID = ID;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setInstrument(String instrument) {
		this.instrument = instrument;
	}

	public void setVolume(int volume) {
		this.volume = volume;
	}

	public void setPan(int pan) {
		this.pan = pan;
	}

	public void setMute(boolean mute) {
		this.mute = mute;
	}

	public void setSolo(boolean solo) {
		if(solo && this.mute) this.mute = false;
		this.solo = solo;
	}

	public void setDefaultSettings() {
		this.instrument = "piano";
		this.volume = 50;
		this.pan = 0;
		this.mute = false;
		this.solo = false;
	}

	public void addRecording(String r) throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		// This recording will come from the client without an ID so we need to give it one
		Recording recording = mapper.readValue(r, Recording.class);
		recording.setID(++this.recordingNum);
		this.recordings.add(recording);
	}

	public void setRecordings(List<Recording> r) {
		this.recordings = r;
	}
}