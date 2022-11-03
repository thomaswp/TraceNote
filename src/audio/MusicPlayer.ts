import * as Tone from "tone";
import { AudioLoader } from "./AudioLoader";

export class MusicPlayer {

    keyFrequency: Tone.FrequencyClass;
    beat = 0;
    tempo;

    constructor(root: string, tempo: number = 2) {
        this.keyFrequency = Tone.Frequency(root);
        this.tempo = tempo;
    }

    chordNumberToHalfSteps(chordNumber: number) {
        chordNumber -= 1;
        while (chordNumber < 0) chordNumber += 7;
        let octaves = Math.floor(chordNumber / 7);
        chordNumber %= 7;
        let intervals = [0, 2, 4, 5, 7, 9, 11];
        return intervals[chordNumber] + octaves * 12;

    }

    playChord(chordNumber: number, beats: number) {
        let minors = [0, 1, 1, 0, 0, 1, 0];
        let root = this.chordNumberToHalfSteps(chordNumber);
        let notes = [root, root + 4 - minors[chordNumber], root + 7];
        console.log(notes);
        this.playNotes(notes, beats);
    }

    playNote(chordNumber: number, beats: number) {
        let halfSteps = this.chordNumberToHalfSteps(chordNumber);
        this.playNotes([halfSteps], beats);
    }

    protected playNotes(notes: number[], beats: number) {
        if (!AudioLoader.isLoaded) return;
        let sampler = AudioLoader.pianoSampler;
        let frequencies = this.keyFrequency.harmonize(notes).map(f => f.toFrequency());
        // console.log(frequencies);
        const now = Tone.now();
        sampler.triggerAttackRelease(frequencies, "8n", now + this.beat / this.tempo);
        this.beat += beats;
    }
}