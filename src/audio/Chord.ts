import * as Tone from "tone";
import { AudioLoader } from "./AudioLoader";

export class Chord {

    baseFrequency: Tone.FrequencyClass;
    beat = 0;


    constructor(root: string) {
        this.baseFrequency = Tone.Frequency(root);
    }

    play(chordNumber: number, beats: number) {
        if (!AudioLoader.isLoaded) return;

        chordNumber = (chordNumber - 1) % 7;

        let sampler = AudioLoader.pianoSampler;
        let intervals = [0, 2, 4, 5, 7, 9, 11];
        let minors =    [0, 1, 1, 0, 0, 1, 0];

        let root = intervals[chordNumber];
        let notes = [root, root + 4 - minors[chordNumber], root + 7];
        console.log(notes);

        let frequencies = this.baseFrequency.harmonize(notes).map(f => f.toFrequency());
        // console.log(frequencies);
        const now = Tone.now();
        sampler.triggerAttackRelease(frequencies, "8n", now + this.beat / 2);
        this.beat += beats;
    }
}