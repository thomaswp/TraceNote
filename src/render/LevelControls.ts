import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Block } from '../code/Block';
import { ExecutionTrace, PlayChordData } from '../code/ExecutionTrace';
import { Level } from '../levels/Levels';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import { Chord } from '../audio/Chord';

@customElement('level-controls')
export class LevelControls extends LitElement {

    @property() set level(level: Level) {
        if (level == this.level) return;
        this.code = level.getCode();
        this.name = level.name;
        this.codeHTML = this.code.render().toString('', true);
        this.trace = new ExecutionTrace();
        this.code.addToTrace(this.trace);

        let oldValue = this._level;
        this._level = level;
        this.requestUpdate('level', oldValue);
    };

    private _level: Level;
    private code: Block;
    private codeHTML = '';
    private name = '';
    private trace: ExecutionTrace;

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
    <div class="code-container">
        <h2>${this.name}</h2>
        <div class="code-content">${unsafeHTML(this.codeHTML)}</div>
        <button class="btn btn-primary" @click="${(this.play)}">Play</button>
    </div>
    `
    }

    private play() {
        let player = new Chord("C3");
        this.trace.data.forEach(event => {
            if (event instanceof PlayChordData) {
                player.play(event.root, 1);
            }
        })
    }

    // private dispatch
}