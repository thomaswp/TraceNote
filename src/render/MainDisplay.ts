import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Input, InputEvent, LeftStickArgs } from '../input/Input';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Level, levels } from '../levels/Levels';
import { LevelControls } from './LevelControls';
import { StickDisplay } from './StickDisplay';
import { ArrowDisplay, VariableDisplay } from './VariableDisplay';
import { LevelMenu } from './LevelMenu';

@customElement('main-display')
export class MainDisplay extends LitElement {

    createRenderRoot() {
        return this;
    }

    @state()
    currentLevel: Level = levels[0];

    render() {
        new LevelMenu();
        new LevelControls();
        new StickDisplay();
        new VariableDisplay();

        return html`
<stick-display></stick-display>
<div class="main-container">
    <level-menu @level-selected=${e=> this.currentLevel = e.detail.level}></level-menu>
    <level-controls .level=${this.currentLevel}></level-controls>
</div>
    `
    }
}