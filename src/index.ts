import * as Tone from 'tone'
import { Sampler } from 'tone';
import { SampleLibrary } from './audio/SampleLibrary'
import { levels, test } from './levels/Levels';
import { LevelRenderer } from './render/LevelRenderer';
import * as bootstrap from 'bootstrap';

window.onload = () => {
    test();

    levels.forEach(level => {
        let div = new LevelRenderer(level).render();
        document.body.appendChild(div);
    });

}