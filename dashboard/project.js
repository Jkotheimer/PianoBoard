/**
 * PROJECT CLASS
 * A project is an object that holds multiple tracks of recordings
 * each recording has notes at different time positions, 
 * which are played back when the project is played
 */
class project {
    tracks = [];
    settings = new Map();
    rulerPosition = 0;
    name = "";
    /**
     * CONSTRUCTOR
     * @param {object} jsonProject: An initial project json object to be converted to a javascript object with methods.
     *      - jsonProject.name : the name of the project
     *      - jsonProject.tracks : An array of json track objects to be read into javascript track objects with methods.
     *      - jsonProject.settings : a map of setting id's to the values saved to them
     *      - jsonProject.rulerPosition : a number representing the tick amount at which the ruler was left saved at.
     */
    constructor(jsonProject) {
        this.name = jsonProject.name;

        var tempTracks = jsonProject.tracks;
        // Iterate through all of the tracks in the o
        for(let i = 0; i < tempTracks.length; i++) {
            var nextTrack = new track(tempTracks[i], this);
            this.tracks.push(nextTrack);
        }
        // Set the initial settings of a project
        this.settings.set("tempo", jsonProject.settings.tempo);
        this.settings.set("timesig", jsonProject.settings.timesig);
        this.settings.set("instrument", jsonProject.settings.instrument);
        this.settings.set("playClick", jsonProject.settings.playClick);
        this.settings.set("mainVolume", jsonProject.settings.mainVolume);

        this.rulerPosition = jsonProject.rulerPosition;
        // TODO : push the object to the user's database slot
    }

    /**
     * GETTERS
     * _____________________________________________________________________________________________________
     */

    // Return the name of the project
    getName() {return this.name;}

    // Return a track object given the number of the track or the array of tracks
    // getTrack(num) {return this.tracks[num];}
    getTrack(num) {return this.tracks[num];}
    getTracks() {return this.tracks;}

    // Return the current position of the ruler
    // Use : Instantiating a new recording or note object, setting the start and end of them
    getRulerPosition() {return this.rulerPosition}

    // Return the settings map or a specific setting to set everything up in the UI
    getSetting(setting) {return this.settings.get(setting);}
    getSettings() {return this.settings;}

    /**
     * END GETTERS
     *
       SETTERS
       __________________________________________________________________________________________________
     */

     // Change the name of the project
    setName(name){this.name = name}

    /**
     * Update the position of the ruler
     *  Use : on playback, updateRuler is called on every iteration through the playback interval
     *        on scrub, updateRuler is called every time the ruler is dragged horizontally
     * 
     * @param {number} pos
     */
    updateRulerPosition(pos) {
        this.rulerPosition = pos;
        return this.rulerPosition;
        // TODO : call an external function to move the UI ruler to the new position then push to the database
    }
    
    /**
     * END SETTERS
     * 
     * GENERAL FUNCTIONALITY
     * ______________________________________________________________________________________________________
     */

    // Push a new track onto the project's track array
    addTrack() {
        var tName = "Track " + String(this.tracks.length);
        var inst = this.settings.get(instrument);
        var jsonTrack = {
            project : this,
            name : tName,
            recordings : {},
            settings : {
                volume : 50,
                pan : 0,
                mute : false,
                solo : false,
                instrument : inst
            }
        }
        var track = new track(jsonTrack);
        this.tracks.push(track);
        return track;
    }

    // Remove a track from the project
    removeTrack(num) {
        this.tracks.splice(num,1);
        // TODO : call an external function to remove this track from the UI then push to the user's database
    }
    /**
     * END GENERAL FUNCTIONALITY
     * 
     * DESTRUCTOR
     * ________________________________________________________________________________________________________
     */

    // Completely delete the current project instance
    deleteProject() {
        delete(this);
        // TODO : remove the object from the user's database slot and update the UI
    }

    /**
     * END PROJECT CLASS
     */
}

/**
 * TRACK CLASS
 * Each track is the child of a project, and holds recordings within it.
 */
class track {
    project = undefined;
    recordings = new Map();
    name = "";
    settings = new Map();
    /**
     * CONSTRUCTOR
     * 
     * @param {object} jsonTrack : A json track object to be converted into a javascript object with methods
     *      * jsonTrack.name: the name of the track
     *      * jsonTrack.recordings: A map of start times pointing to recording objects
     *      * jsonTrack.settings: A map of setting ids to thier values for the 
     */
    constructor(jsonTrack, project) {
        this.project = project;

        this.name = jsonTrack.name;
        
        // Set each of the recordings from the recordings array to objects then add them to this array
        var tempRecordings = jsonTrack.recordings;
        if(tempRecordings.length > 0) {
            for(let rec of tempRecordings.keys()) {
                var nextRecording = new recording(tempRecordings.get(rec));
                this.recordings.set(rec, nextRecording);
            }
        }
        // initialize the settings
        this.settings.set("volume", jsonTrack.settings.volume);
        this.settings.set("pan", jsonTrack.settings.pan);
        this.settings.set("mute", jsonTrack.settings.mute);
        this.settings.set("solo", jsonTrack.settings.solo);
        // TODO : call an external function to display a new track on the UI, then update the user's database
    }

    /**
     * GETTERS
     * ____________________________________________________________________________________________________
     */

    // Return the number of the track relative to it's parent project's tracks array
    getNumber() {
        // Retrieve the tracks array from the parent project
        var projectsTracks = this.project.getTracks();
        // Iterate through the array, and when we find this track, return the index.
        for(let i = 0; i < projectsTracks.length; i++) {
            if(projectsTracks[i] == this) {
                return i;
            }
        }
    }

    // Return the array of recordings
    getRecordings() {return this.recordings;}

    // Return the name of the track
    getName() {return this.name;}

    // static the settings to write to the UI
    getSettings(){return this.settings;}

    // Return the parent project object of this track
    parentProject() {return this.project;}

    /**
     * END GETTERS
     * 
     * SETTERS 
     * ______________________________________________________________________________________________________
     */

    // Change the name of the track
    setName(name) {
        this.name = name;
        return this.name;
        // TODO : call an external function to push the changes to the user's database
    }

    // Write a new value to a setting
    writeSetting(setting, value) {
        this.settings.set(setting, value);
        return this.settings;
        // TODO : push the changes to the user's database slot
    }

    /**
     * END SETTERS
     * 
     * GENERAL FUNCTIONALITY
     * _____________________________________________________________________________________________________
     */

    // Add or remove a recording from the track
    addRecording() {
        var time = this.project.getRulerPosition();

        // determine the number of the new track by iterating through all the other recordings within this track
        // and set it equal to the largest number, then increment it by one.
        var number = 0;
        for(let item of this.recordings.keys()) {
            var nextNum = this.recordings.get(item).getNumber()
            if(number < nextNum) number = nextNum; 
        }
        number++;
        var jsonRecording = {
            track : this,
            number : number,
            isRecording : true,
            notes : {},
            startTime : this.project.getRulerPosition(),
            length : 0,
        }
        var rec = new recording(jsonRecording);
        this.recordings.set(time, rec);
        return rec;
    }
    removeRecording(recording) {
        // iterate through the recordings once to remove the one we want removed
        var remNum = recording.getNumber();
        for(let item of this.recordings.keys()) {
            if(this.recordings.get(item) == recording){
                this.recordings.delete(item);
                break;
            }
        }
        // Iterate through the recordings again to renumber all of the other recordings accordingly
        for(let item of this.recordings.keys()) {
            var rec = this.recordings.get(item)
            if(rec.getNumber() > remNum) {
                rec.setNumber(rec.getNumber() - 1);
            }
        }
        // TODO : Call an external function to remove the recording from the UI then update the user's database
    }

    /**
     * END GENERAL FUNCTIONALITY
     * 
     * DESTRUCTOR
     * _______________________________________________________________________________________________________
     */

    // Remove this track from it's parent project
    delete() {
        // Delegates to the parent project for simplicity in the UI design
        this.project.removeTrack(this.getNumber());
        delete(this);
    }

    /**
     * END TRACK CLASS
     */
}

/**
 * RECORDING CLASS
 * Each recording is the child of a track, and contains a map of notes
 */
class recording {
    track = undefined;
    project = undefined;
    notes = new Map();
    isRecording = false;
    number = 0;
    startTime = 0;
    length = 0;
    /**
     * CONSTRUCTOR
     * 
     * @param {object} jsonRecording: the json representation of a recording to be converted to javascript for methods
     *      * jsonRecording.track: the parent track that this recording resides within
     *      * jsonRecording.isRecording: A boolean that is initialized to true, becomes false when the user stops recording,
     *                                  and cannot become true again.
     *      * jsonRecording.notes: A map of relative times pointing to note objects
     *      * jsonRecording.startTime: The time relative to the project's 0 marker at which the recording starts
     *      * jsonRecording.length: the length of the recording - updated when the recording is ended
     */
    constructor(jsonRecording, track) {
        this.track = track;
        this.project = this.track.parentProject();

        var tempNotes = jsonRecording.notes; // <number startTime, object note>
        for(let note of tempNotes.keys()) {
            var nextNote = new note(tempNotes.get(note));
            this.notes.set(note, nextNote);
        }
        this.number = jsonRecording.number;
        this.isRecording = jsonRecording.isRecording;
        this.startTime = jsonRecording.startTime;
        this.length = jsonRecording.length;
        // TODO : call an external function do display a new recording on the UI, then push to the database
    }

    /**
     * GETTERS
     * _____________________________________________________________________________________________________
     */

    // Return the number of the Recording relative to it's parent track's recordings array
    getNumber() {return this.number;}

    // Return the startTime and endTimeof the recording
    getStartTime() {return this.startTime;}
    getLength() {return this.length;}

    // Return the boolean determining if the recording is currently running
    isRecording() {return this.isRecording;}

    // Return the parent project object
    parentProject() {return this.project;}

    /**
     * END GETTERS
     * 
     * SETTERS
     * ________________________________________________________________________________________________
     */

    /**
     * Add a new note object with the to the recording if it is still recording
     * 
     * @param {string} note: A string representing the note being added -> 'C#3', 'E4', 'A#2'
     * @param {number} length: the duration the note is held out for before it fades out
     * No need to push to the database.  This would immensely fuck up the UX, as the animations would lag
     * **DURING RECORDING PROCESS
     */ 
    addNote(note, length) {
        if(this.isRecording) {
            var time = this.project.getRulerPosition();
            var instrument = this.track.getSettings().get("instrument");
            var jsonNote = {
                instrument : instrument,
                note : note,
                recording : this,
                length : length
            }
            var noteObject = new note(jsonNote);
            this.notes.set(time, noteObject);
            return noteObject;
        }
        else return undefined;
    }

    /**
     * Set the length of the recording (used when clipping a recording in half)
     * **POST RECORDING PROCESS
     * 
     * @param {number} length
     */
    setLength(length) {
        this.length = length
        return this.length;
    }

    /**
     * Set the number of the recording relative to the time of creation of the other recordings within the tracks
     * @param {number} number 
     */
    setNumber(number) {
        this.number = number;
        return this.number;
    }

    /**
     * Set the startTmie of a recording (used when clipping a recording in half)
     * **POST RECORDING PROCESS
     * @param {number} time
     */
    setStartTime(time) {
        this.startTime = time;
        return this.startTime;
    }

    // Change the parent recording of an existing note to this recording instance and add it to the notes array
    // **POST RECORDING PROCESS
    setNote(note) {
        note.setParentRecording(this);
        this.notes.push(note);
    }

    // Move the recording to newStartTime, updating the start and end times
    // **POST RECORDING PROCESS
    moveTo(newStartTime) {
        // First, we have to check if this new position overlaps with any other recordings within the track
        var newEndTime = this.length + newStartTime;
        var overlap = function(){
            var recordings = this.track.getRecordings();
            for(let i = 0; i < recordings.length; i++) {
                if(recordings[i] == this) continue;
                var currentStart = recordings[i].getStartTime();
                var currentEnd = recordings[i].getLength() + currentStart;
                /**
                 * visual representation of overlap
                 *         45               120
                 *        c_strt___________c_end (c_end = c_strt + c_lngth)
                 *   ________|_______________|
                 *  |____________|
                 * n_strt      n_end
                 *  0            60
                 *            ^^^--- overlap
                 * if (c_strt < n_end) && (c_end > n_end), there is overlap
                 * and vice versa if the overlap is over n_strt
                 */
                if(currentStart < newEndTime && currentEnd > newEndTime ||
                   currentEnd > newStartTime && currentStart < newStartTime) {
                    // TODO : instead of return true, prompt the user and ask if it's okay that theyre gonna overlap
                    // if it's okay, we remove the overlapped portion of the recording being overlapped
                    return true;
                }
            }
            return false;
        }
        if(!overlap) {
            this.startTime = newStartTime;
            // TODO : update the UI and push to the user's database
        }
        return this.startTime;
    }

    /**
     * END SETTERS
     * 
     * GENERAL FUNCTIONALITY
     * ____________________________________________________________________________________________________
     */

    // Stop the recording : set the endtime to the current ruler position, and set the isRecording var to false
    // **CALLED TO END RECORDING PROCESS
    stopRecording() {
        this.length = this.project.getRulerPosition() - this.startTime;
        this.isRecording = false;
        return this;
        // TODO : Update the UI and push the changes to the user's database
    }

    // cut the recording at the current ruler position, creating a new recording, and shortening this recording
    cut() {
        // You can't cut a track that is in the middle of recording
        if(this.isRecording) return false;

        var rp = this.project.getRulerPosition();
        // create a new recording, which automatically has the correct startTime
        var secondRec = new recording(JSON.stringify(this));
        // set the start time of the new recording
        secondRec.setStartTime(rp);
        // Set the new length of both recordings
        var secondLength = this.getLength() - (rp - this.getStartTime())
        secondRec.setLength(secondLength);
        var newLength = rp - this.getStartTime();
        this.setLength(newLength);
        // move all notes that start after the current position from this instance to the new recording
        for(let i = 0; i < this.notes.length; i++) {
            // if the current note's start time is after the new length of the original recording, it resides within the new recording now.
            if(this.notes[i].getStartTime() > this.getLength()) {
                // Set the note's parent recording to the new recording and push it to it's note array
                secondRec.setNote(this.notes[i]);
                // then remove the note from this instance's notes array
                delete this.notes[i];
                // move everything in the array over one, then pop off the last arbitrary element
                for(let j = i; j < this.notes.length-1; j++) {
                    this.notes[j] = this.notes[j+1];
                }
                this.notes.pop();
            }
        }
        // We now have two separate recordings with the notes in the same spot.
        // (although their start times altered relative to their new parent recording)
        // TODO : update the UI and push the changes to the user's database
    }

    /**
     * This function iterates through each note in the recording and forms chords out of notes 
     * that are closer than 50 ms apart.  
     * 
     * This will not be perfect in terms of the UX.  Some notes may be pushed together that the user doesn't
     * want pushed together, so we need to add a function to allow the user to revert either the whole action
     * or revert certain notes that they didn't want to be pushed into chords.
     * 
     * HOW IT WORKS:
     * -------------
     * Iterate through each note, and if the next note's starting position is less than 50ms away, add them
     * to an array together, and continue until the next note is more than 50ms away.  When that happens,
     * go through each of the notes in the closeNotes array, and set their start times to the average of 
     * all of their start times.  Therefore, each start time will be the same, so on playback, it will be played
     * as a chord.
     */
    formChords() {
        var closeNotes = [];
        var chords = new Set();
        var finalChords = new Set();
        // msConverter is how many ms are in each ruler tick
        var msConverter = 2000 / this.project.getSettings.get("tempo");
        for(let i = 0; i < this.notes.length; i++) {
            if(chords.has(this.notes[i])) continue;
            var currentTime = this.notes[i].getStartTime();
            closeNotes.push(this.notes[i]);
            for(let j = i + 1; j < this.notes.length; j++) {
                // if we've already formed this note into a chord or i == j, continue
                if(chords.has(this.notes[j]) || i == j) continue;
                // diff is in ruler ticks, so it needs to be converted to ms
                var diff = Math.abs(currentTime - this.notes[j].getStartTime());
                diff = diff * msConverter;
                if(diff < 50) closeNotes.push(this.notes[j]);
            }
            // if the length of closeNotes is greater than one, then a chord may be formed
            if(closeNotes.length > 1) {
                // Calculate the average of all of the start times and set it to all of them
                var sum = 0;
                finalChords.add(closeNotes);
                for(let j = 0; j < closeNotes.length; j++) {
                    sum += closeNotes[j].getStartTime();
                }
                var avg = sum / closeNotes.length;
                for(let j = 0; j < closeNotes.length; j++) {
                    closeNotes[j].setTimeRelative(avg);
                    chords.add(closeNotes[j]);
                }
            }
            // Reset and start over
            closeNotes = [];
        }
        return finalChords;
    }

    /**
     * END GENERAL FUNCTIONALITY
     * 
     * DESTRUCTOR
     * _________________________________________________________________________________________________
     */

    // Remove the recording from it's parent track's recordings array, delete the variable, then update the UI
    delete() {
        // Delegates to the parent track for simplicity on the UI end
        this.track.removeRecording(this);
        delete(this);
    }
    /**
     * END RECORDING CLASS
     */
}

/**
 * NOTE CLASS
 * Every note is the child of a recording, which is the child of a track, which is the child of a project
 * Each note has an instrument tied to it, a value of the note's pitch, and a time at which it is played
 * 
 */
class note {
    /**
     * CONSTRUCTOR
     * 
     * @param {object} jsonNote: A json note object to be converted to javascript object with methods
     *      * jsonNote.instrument : the instrument used to play this note
     *      * jsonNote.note : the string determining which pitch the note to be played is
     *      * jsonNote.recording : the note's parent recording under which it resides
     *      * jsonNote.length : the length the note is held out until it quickly fades out 
     *          - During the recording process, the note object is created on keyup, so the length
     *              will be known during the creation of the object.  Methods may be used to change anything in post
     */
    instrument = "";
    note = "";
    recording = undefined;
    project = undefined;
    length = 0;
    constructor(jsonNote) {
        this.instrument = jsonNote.instrument;
        this.note = jsonNote.note;
        this.recording = jsonNote.recording
        this.project = this.recording.parentProject();
        this.length = jsonNote.length;
    }
    /**
     * BEGIN GETTERS
     * ______________________________________________________________________________________________
     */

    // Return the time at which the note begins to fade out (relative to the start time)
    getFade() {return this.fadeTime;}

    // Return the note string of the note
    getNote() {return this.note;}

    // Return the instrument that the note is played by
    getInstrument() {return this.instrument;}

    /**
     * END GETTERS
     * 
     * BEGIN SETTERS
     * ________________________________________________________________________________________________________
     */

    // Set the time at which the note is played when played back. 
    // Use : The user didn't play their part perfectly and they drag and drop the note to a different position.
    // **POST RECORDING PROCESS
    setTimeUniversal(universalTime) {
        this.startTime = universalTime - this.recording.getStartTime();
        return this.startTime;
    }
    setTimeRelative(relativeTime) {
        this.startTime = relativeTime;
        return this.startTime;
    }

    // Set the time after the start time at which the note fades out
    // Use : when the user lifts their finger off the key, the note quickly but smoothly fades out
    // **DURING RECORDING PROCESS
    setFade(universalTime) {
        this.fadeTime = universalTime - this.startTime;
        return this.fadeTime;
    }

    // Change the pitch of the note
    // Use :  the user didn't play the correct note when recording, so they can change the note
    // **POST RECORDING PROCESS
    setNote(note) {
        this.note = note;
        return this.note;
    }

    // Change the instrument that this note gets played by on playback.
    // **POST RECORDING PROCESS
    setInstrument(instrument) {
        this.instrument = instrument;
        return this.instrument;
    }

    // Change the recording under which this note resides, and change the start time relative to the new recording
    // **POST RECORDING PROCESS
    setParentRecording(recording) {
        var originalRecStart = this.recording.getStartTime();
        var originalNoteStart = this.startTime;
        var newRecStart = recording.getStartTime();
        this.startTime = (originalRecStart + originalNoteStart) - newRecStart;
        this.recording = recording;
    }
    /**
     * END SETTERS
     * 
     * GENERAL FUNCTIONALITY
     * ______________________________________________________________________________________________________
     */

    // Retrieve the audio object corresponding to the note's instrument and pitch, and play it.
    // **PLAYBACK
    play() {
        var file = document.getElementById(note);
        var tempo = this.project.getSettings().get("tempo");
        file.volume = 1.0;
        file.load();
        file.play();
        var ticks = 0;
        if(this.fadeTime) {
            var hold = setInterval(function() {
                if(ticks == this.fadeTime) {
                    // TODO : route to external function to quickly fade out the note
                    file.load();
                    clearInterval(hold);
                }
                ticks++;
            }, 2000 / tempo);
        }
    }

    /**
     * END GENERAL FUNCTIONALITY
     * 
     * DESTRUCTOR
     * _____________________________________________________________________________________________________
     */

    // Remove the note from the parent recording and completely delete the instance
    delete() {
        // Delegate to the parent recording
        this.recording.removeNote(this);
        delete(this);
    }

    /**
     * END NOTE CLASS
     */
}