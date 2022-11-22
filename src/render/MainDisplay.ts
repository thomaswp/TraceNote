import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Input, InputEvent, LeftStickArgs } from '../input/Input';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import { levels } from '../levels/Levels';
import { LevelControls } from './LevelControls';
import { StickDisplay } from './StickDisplay';
import { VariableDisplay } from './VariableDisplay';

@customElement('main-display')
export class MainDisplay extends LitElement {

    createRenderRoot() {
        return this;
    }

    render() {
        new LevelControls();
        new StickDisplay();
        new VariableDisplay();

        return html`
    <div class="main-container">
        <stick-display></stick-display>
        <div class="levels">
            ${levels.map(level => {
                return html`<level-controls .level=${level}></level-controls>`;
            })}
        </div>
    </div>
    `
    }
}