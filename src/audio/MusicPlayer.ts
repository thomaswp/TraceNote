import * as Tone from "tone";
import { AudioLoader } from "./AudioLoader";

export class MusicPlayer {

    keyFrequency: Tone.FrequencyClass;
    tempo;
    nextReady: number;
    timeouts: Set<NodeJS.Timeout> = new Set();

    constructor(root: string, tempo: number = 4) {
        this.keyFrequency = Tone.Frequency(root);
        this.tempo = tempo;
        this.nextReady = Tone.Transport.now();
    }

    // ready() {
    //     if (AudioLoader.pianoSampler.disposed) {
    //         AudioLoader.pianoSampler.toDestination();
    //         console.log("DEST", AudioLoader.pianoSampler.output);
    //     }
    // }

    stop() {
        // TODO: This doesn't work b/c it's not bound to the transport
        // but binding to the transport creates timing issues
        // AudioLoader.pianoSampler.releaseAll();
        if (AudioLoader.pianoSampler) {
            // TODO: This is a very simple hack to stop the playback but
            // it's a bit jarring and has sync issues with the JS callbacks
            AudioLoader.pianoSampler.dispose();
            // AudioLoader.pianoSampler.context.
        }
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts.clear();
    }

    whenReady(callback: () => void) {
        let now = Tone.now();
        let until = Math.max(0, this.nextReady - now);
        // console.log(now, until);
        let t: NodeJS.Timeout;
        t = setTimeout(() => {
            this.timeouts.delete(t);
            callback();
        }, until * 1000);
        this.timeouts.add(t);
    }

    chordNumberToHalfSteps(chordNumber: number) {
        chordNumber -= 1;
        while (chordNumber < 0) chordNumber += 7;
        let octaves = Math.floor(chordNumber / 7);
        chordNumber %= 7;
        let intervals = [0, 2, 4, 5, 7, 9, 11];
        return intervals[chordNumber] + octaves * 12;

    }

    playSqueal(note: number) {
        let notes = [0, 1, 2, 3, 4].map(n => n + note);
        this.playNotes(notes, 0.25);
    }

    playSuccess() {
        let notes = [0, 4, 7, 5, 9, 14, 12]
        notes.forEach(n => {
            this.playNotes([n], 0.7);
        });
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

    protected playNotes(notes: number[], beats: number) : Promise<void> {
        if (!AudioLoader.isLoaded) return;
        let sampler = AudioLoader.pianoSampler;
        let frequencies = this.keyFrequency.harmonize(notes).map(f => f.toFrequency());
        // console.log(frequencies);
        // Either start now
        const start = Math.max(this.nextReady, Tone.now());
        sampler.triggerAttackRelease(frequencies, "8n", start);
        this.nextReady = start + beats / this.tempo;

        // return new Promise((resolve) => {
        //     setTimeout(() => {

        //     }, );
        // });
    }
}