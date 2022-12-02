import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Input, InputEvent, InputNames, LeftStickArgs } from '../input/Input';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Level, levelCategories, levelMap, levels } from '../levels/Levels';
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
    level: Level = levels[0];

    render() {
        new LevelMenu();
        new LevelControls();
        new StickDisplay();
        new VariableDisplay();

        return html`
<stick-display></stick-display>
<div class="main-container">
    <level-menu .selectedLevel=${this.level} @level-selected=${e => this.level = e.detail.level}></level-menu>
    <level-controls .level=${this.level}></level-controls>
</div>
    `
    }

    override connectedCallback(): void {
        super.connectedCallback();
        Input.pressed(InputNames.DPadLeft).add(() => this.changeLevel(-1), this);
        Input.pressed(InputNames.DPadRight).add(() => this.changeLevel(1), this);
        Input.pressed(InputNames.DPadUp).add(() => this.changeCategory(-1), this);
        Input.pressed(InputNames.DPadDown).add(() => this.changeCategory(1), this);
    }

    override disconnectedCallback(): void {
        InputEvent.removeFromAllEvents(this);
        super.disconnectedCallback();
    }

    private changeLevel(by: number) {
        if (!this.level) return;
        let index = levels.indexOf(this.level);
        if (index < 0) return;
        index += by;
        if (index < 0 || index >= levels.length) return;
        this.level = levels[index];
    }

    private changeCategory(by: number) {
        if (!this.level) return;
        let index = levelCategories.indexOf(this.level.category);
        if (index < 0) return;
        index += by;
        if (index < 0 || index >= levelCategories.length) return;
        let category = levelCategories[index];
        this.level = levelMap.get(category)[0];
    }
}