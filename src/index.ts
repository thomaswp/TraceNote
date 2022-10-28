import * as Tone from 'tone'
import { Sampler } from 'tone';
import { SampleLibrary } from './audio/SampleLibrary'
import { test } from './levels/Levels';

console.log("!");

window.onload = () => {

    test();

    let button = document.createElement('button');
    button.innerHTML = "Play!";
    document.body.appendChild(button);

    let pianoSampler: Sampler;

    button.onclick = async () => {
        await Tone.start();

        SampleLibrary.minify = true;

        function play() {
            const now = Tone.now()
            pianoSampler.triggerAttackRelease("C3", "4n");
            pianoSampler.triggerAttackRelease("E3", "4n", now + 1);
            pianoSampler.triggerAttackRelease("G3", "4n", now + 2);
            pianoSampler.triggerAttackRelease("C3", "2n", now + 3);
            pianoSampler.triggerAttackRelease("E3", "2n", now + 3);
            pianoSampler.triggerAttackRelease("G3", "2n", now + 3);
            // piano.triggerAttack("F3");
            // piano.triggerAttack("G3");
        }

        if (pianoSampler && pianoSampler.loaded) {
            play();
            return;
        }

        // passing a single instrument name loads one instrument and returns the tone.js object
        pianoSampler = SampleLibrary.load({
            instruments: "piano",
            onload: () => {
                pianoSampler.toDestination();
                play();
            }
        });

        // passing an array of instrument names will load all the instruments listed returning a new object,
        // each property a tone.js object
        // var instruments = SampleLibrary.load({
        //     instruments: ["piano","harmonium","violin"]
        // });

        // waits for instrument sound files to load from /samples/
        // Tone.Buffer.load()
        // Tone.Buffer.on('load', function() {
        //     // play instrument sound
        //     instruments['piano'].toMaster();
        //     instruments['piano'].triggerAttack("A3");
        // });
    }

}