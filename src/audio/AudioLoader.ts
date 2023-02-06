import * as Tone  from "tone";
import { Sampler } from "tone";
import { SampleLibrary } from "./SampleLibrary";

export class AudioLoader {

    static isLoaded = false;
    static pianoSampler: Sampler;

    static async loadAll() {
        if (this.isLoaded && !this.pianoSampler.disposed) return;
        await Tone.start();

        SampleLibrary.minify = true;

        function play() {
            // const now = Tone.now()
            // this.pianoSampler.triggerAttackRelease("C3", "4n");
            // pianoSampler.triggerAttackRelease("E3", "4n", now + 1);
            // pianoSampler.triggerAttackRelease("G3", "4n", now + 2);
            // pianoSampler.triggerAttackRelease("C3", "2n", now + 3);
            // pianoSampler.triggerAttackRelease("E3", "2n", now + 3);
            // pianoSampler.triggerAttackRelease("G3", "2n", now + 3);
            // piano.triggerAttack("F3");
            // piano.triggerAttack("G3");
        }

        return new Promise<void>((resolve, reject) => {
            // passing a single instrument name loads one instrument and returns the tone.js object
            this.pianoSampler = SampleLibrary.load({
                instruments: "guitar-acoustic",
                onload: () => {
                    this.pianoSampler.toDestination();
                    // this.pianoSampler.sync();
                    // Tone.Transport.start();
                    this.isLoaded = true;
                    resolve();
                }
            });

        });
    }
}

