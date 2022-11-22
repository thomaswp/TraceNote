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

    @property()
    variables: Variable<any>[];

    @state()
    private values = [];

    init() {
        this.values = this.variables.map(v => null);
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
        <table>
            <tr>${this.variables.map(v => unsafeHTML('<th>' + new VariableLayout(v).toString('', true) + '</th>'))}</tr>
            <tr>${this.values.map(v => html`<td>${v == null ? '\u2205' : v}</td>`)}</tr>
        </table>
    </div>
    `
    }


}