/**
 * A project has settings and tracks
 * each track has settings and recordings
 * each recording has notes at different time positions
 */
class project {
    constructor() {
        this.tracks = new Map();
        // settings will be a map of studioSettingNames : Values
        this.settings = new Map();
        this.rulerPosition = 0;
    }

    addTrack() {
        // add a track object to the project
        var number = tracks.size() + 1;
        var track = new track(this, number);
        this.tracks.set(number.toString(), track);
    }

    deleteTrack(trackNum) {
        this.tracks.delete(trackNum);
    }

    updateRulerPosition(pos) {
        this.rulerPosition = pos;
    }
    
    getRulerPosition(){
        return this.rulerPosition
    }
}

class track {
    constructor(project, number) {
        // recordings is a set of recording objects
        this.recordings = new Map();
        this.number = number;
        this.name = "Track " + number.toString();
        this.project = project;
        this.settings = new Map();
    }

    /** Track name methods */
    changeNameTo(name) {this.name = name;}
    getName() {return this.name;}

    getNumber() {
        return this.number;
    }

    addRecording(recording) {
        this.recordings.add(new recording(this.project));
    }

    writeSetting(setting, value) {
        this.settings.set(setting, value);
    }

    getSettings(){
        return this.settings;
    }
}

class recording {
    constructor(project) {
        // A note map (note : time)
        this.notes = new Map();
        this.isRecording = true;
        this.project = project;
        // Start and end times
        this.startTime = project.getRulerPosition();
        this.endTime = project.getRulerPosition();
    }

    addNote(note) {
        if(this.isRecording) {
            this.notes.add(new Note(note, this.project.getRulerPosition()));
            return true;
        }
        else return false;
    }

    stopRecording() {
        this.endTime = project.rulerPosition();
    }

    isRecording() {
        return this.isRecording;
    }
}

class Note {
    constructor(instrument, note, time) {
        // the time is global
        this.time = time;
        // the note is a string
        this.note = note;
        // the instrument determines which folder to go into
        this.instrument = instrument;
    }
    getTime(){return this.time;}
    getNote(){return this.note;}

    play() {
        var file = document.getElementById(note);
        file.volume = 1.0;
        file.load();
        file.play();
    }
    
}