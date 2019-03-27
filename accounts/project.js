/**
 * A project has settings and tracks
 * each track has settings and recordings
 * each recording has notes at different time positions
 */
class project {
    constructor() {
        // recordings will be an array of track objects
        //     0       1       2       3       4    ...
        // [track1, track2, track3, track4, track5, ...]
        this.tracks = new Set();
        // settings will be a map of studioSettingNames : Values
        this.settings = new Map();
    }

    addTrack() {
        // add a track object to the project
        var trackNum;
        for(let T of )
        var track = new track(this);
        this.tracks.add(track);
    }

    deleteTrack(track) {
        this.tracks.remove(track);
    }
}

class track {
    constructor(project, number) {
        // recordings is a set of recording objects
        this.recordings = new Set();
        const project = project;
        const number = number;
    }

    addRecording(recording) {
        recordings.add(new recording(this.project, this.project.getRulerPosition()));
    }

    updateRulerPosition() {
        this.rulerPosition = project.getRulerPosition();
    }

    number() {
        return this.number;
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