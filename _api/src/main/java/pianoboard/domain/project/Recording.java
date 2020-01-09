package pianoboard.domain.project;

import java.util.Map;
import java.util.HashMap;
import java.util.Collections;

public class Recording {

	// A map of absolute times to note strings
	private Map<Float, String> notes;
	private int ID;
	private float start;
	private float end;

	public Recording() {}

	public Recording(int ID, float start, float end, Map<Float, String> notes) {
		this.ID = ID;
		this.start = start;
		this.end = end;
		this.notes = notes;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public int getID() {
		return this.ID;
	}

	public float getStart() {
		return this.start;
	}

	public float getEnd() {
		return this.end;
	}

	public float getLength() {
		return (this.end - this.start);
	}

	public Map<Float, String> getNotes() {
		return this.notes;
	}

	/**
	 * getNotesInRange(float,float)
	 *
	 * @param start	- The earliest time from which to check for existing notes in this recording
	 * @param end	- The latest time from which top check for existing notes in this recording
	 * @return A map of the notes in this recording that are between the given start and end times
	 */
	public Map<Float, String> getNotesInRange(float start, float end) {
		Map<Float, String> notesInRange = new HashMap<Float, String>();
		for(float time : this.notes.keySet())
			if(time >= start && time <= end) notesInRange.put(time, this.notes.get(time));
		if(notesInRange.isEmpty()) return null;
		return notesInRange;
	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setID(int ID) {
		this.ID = ID;
	}

	public void setStart(float start) {
		this.start = start;
	}

	public void setEnd(float end) {
		this.end = end;
	}

	public void move(float start) {
		float diff = this.start - start;
		this.start = start;
		this.end -= diff;
	}

	public void addNote(float time, String note) {
		if(time < this.start) this.start = time;
		if(time > this.end) this.end = time;
		this.notes.put(time, note);
	}

	public void addNotes(Map<Float, String> notes) {
		for(Float time : notes.keySet()) {
			if(time.floatValue() < this.start) this.start = time.floatValue();
			if(time.floatValue() > this.end) this.end = time.floatValue();
			this.notes.put(time, notes.get(time));
		}
	}

	public void setNotes(Map<Float, String> notes) {
		this.start = Collections.min(notes.keySet());
		this.end = Collections.max(notes.keySet());
		this.notes = notes;
	}
}
