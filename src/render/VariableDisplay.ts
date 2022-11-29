import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Input, InputEvent, LeftStickArgs } from '../input/Input';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import { VarCategory, Variable } from '../code/Variable';
import { VariableLayout } from '../code/RenderNode';
import { UpdateVarData } from '../code/ExecutionTrace';

@customElement('variable-display')
export class VariableDisplay extends LitElement {

    static styles = css`

    `

    createRenderRoot() {
        return this;
    }

    @property()
    variables: Variable<any>[];

    @state()
    private values = [];

    init() {
        this.values = this.variables.map(v => null);
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.init();
    }

    updateVariable(event: UpdateVarData) {
        let index = this.variables.findIndex(v => v.name == event.name);
        if (index < 0) return;
        this.values[index] = event.value;
        this.values = this.values.slice();
    }

    render() {
        return html`
    <div>
        <p>Variables:</p>
        <table class="table table-bordered" style="width: inherit;">
            <tr>${this.variables.map(v => unsafeHTML('<th>' + new VariableLayout(v).toString('', true) + '</th>'))}</tr>
            <tr>${this.values.map((v, index) => this.getVariable(index))}</tr>
        </table>
    </div>
    `
    }

    private getVariable(index: number) {
        let variable = this.variables[index];
        let value = this.values[index];
        if (variable.type == VarCategory.Note || variable.type == VarCategory.Chord) {
            return html`<td><arrow-display .value=${value} /></td>`;
        } else {
            return html`<td><boolean-display .value=${value} /></td>`;
        }
    }

}
new VariableDisplay();

@customElement('arrow-display')
export class ArrowDisplay extends LitElement {

    static styles = css`
        .arrow {
            width: 30px;
            height: 12px;
            /* position: absolute; */
            transform-origin: center;
            /* left: 15px;
            top: 60px; */
            transition: transform 0.1s;
        }

        .hidden {
            visibility: hidden; 
        }
    `

    @property()
    value: number = null;

    @state()
    rotation: number = 0;

    render() {
        return html`
    <div class="container">
        <img class=${classMap({arrow: true, hidden: this.value == null})} style="transform: rotate(${(this.value - 1) * 45}deg)" src="img/arrow.png">
    </div>
    `
    }
}
new ArrowDisplay();

@customElement('boolean-display')
export class BooleanDisplay extends LitElement {

    static styles = css`
        .container {
            font-family: monospace;
            font-size: large;
            text-align: center;
        }

        .hidden {
            visibility: hidden; 
        }

        p {
            margin: 0;
        }
    `

    @property()
    value: boolean = null;

    render() {
        return html`
    <div class="container">
        <p class=${classMap({hidden: this.value == null})}>${this.value ? '\u{2611}' : '\u{2612}'}</p>
    </div>
    `
    }
}

new BooleanDisplay();