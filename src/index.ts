import * as bootstrap from 'bootstrap'; // Don't delete unused
import { levels } from './levels/Levels';
import { LevelControls } from './render/LevelControls';
import { MainDisplay } from './render/MainDisplay';
import { StickDisplay } from './render/StickDisplay';


window.onload = () => {

    new MainDisplay();
    document.body.appendChild(document.createElement('main-display'));

    // Have to construct to register for some reason...
    // new LevelControls();
    // new StickDisplay();

    // let stickDisplay = document.createElement('stick-display') as StickDisplay;
    // document.body.appendChild(stickDisplay);
    // levels.forEach(level => {
    //     let lc = document.createElement('level-controls') as LevelControls;
    //     lc.level = level;
    //     document.body.appendChild(lc);
    // });

}