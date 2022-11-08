import * as Tone from "tone";
import { AudioLoader } from "./AudioLoader";

export class MusicPlayer {

    keyFrequency: Tone.FrequencyClass;
    beat = 0;
    tempo;
    start: number;

    constructor(root: string, tempo: number = 4) {
        this.keyFrequency = Tone.Frequency(root);
        this.tempo = tempo;
        this.start = Tone.now();
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
        let notes = [root, root + 4 - minors[chordNumber - 1], root + 7];
        this.playNotes([root], beats / 2);
        this.playNotes(notes, beats / 2);
        // let sep = 0.15;
        // this.playNotes([notes[0]], sep);
        // this.playNotes([notes[1]], sep);
        // this.playNotes([notes[2]], beats / 2 - sep * 2);
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
        const now = this.start;
        sampler.triggerAttackRelease(frequencies, "8n", now + this.beat / this.tempo);
        this.beat += beats;
    }
}