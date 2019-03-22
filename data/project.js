class project {
    constructor() {
        // recordings will be a set of trackObjects
        this.tracks = new Set();
        // settings will be a map of studioSettingNames : Values
        this.settings = new Map();
    }

    add(track) {
        // add a track object to the project
        this.tracks.add(track);
    }

    delete(track) {
        this.tracks.remove(track);
    }
}

class track {
    constructor(pos) {
        // recordings is a set of recording objects
        this.recordings = new Set();
        // when constructing a new track, throw the current ruler position to autoset it.
        this.rulerPosition = pos;
    }

    addRecording(recording) {
        recordings.add(new recording(this, this.getRulerPosition()));
    }

    getRulerPosition() {
        return this.rulerPosition;
    }

    setRulerPosition(pos) {
        this.rulerPosition = pos;
    }
}

class recording {
    constructor(track, startTime) {
        // the recording is attached to a track
        this.track = track;
        // the recording has a start and stop time (stopTime isn't known at construction)
        this.startTime = startTime;
        this.endTime = startTime;
        this.notes = new Map();
        this.isRecording = true;
    }

    addNote(time, note) {
        if(this.isRecording) {
            notes.add(new Note(time, note));
            return true;
        }
        else return false

    }
    /*  I want these functions to return the current time that the ruler is at globally
        and what time the ruler is at relative to the start of the recording

    getGlobalTime() {
        return **GlobalTime**;
    }

    getRelativeTime() {
        return **RelativeTime**;
    }

    */

    stopRecording(endTime) {
        this.endTime = endTime;
    }

    isRecording() {
        return this.isRecording;
    }

    getTrack() {
        return this.track;
    }
}

class Note {
    constructor(time, note) {
        // the time is global
        this.time = time;
        // the note is a char
        this.note = note;
    }
}