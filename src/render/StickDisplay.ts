import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Input, InputEvent, LeftStickArgs } from '../input/Input';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

@customElement('stick-display')
export class StickDisplay extends LitElement {

    static styles = css`

        .stick-display {
            width: 180px;
            height: 180px;
        }

        .arrow {
            width: 150px;
            height: 60px;
            position: absolute;
            transform-origin: center;
            left: 15px;
            top: 60px;
        }

        .circle {
            height: 25px;
            width: 25px;
            left: calc((180px - 25px) / 2);
            top: calc((180px - 25px) / 2);
            background-color: #464646;
            opacity: 0.5;
            border-radius: 50%;
            display: inline-block;
            position: absolute;
        }

        .hidden {
            display: none;
        }
    `

    @state()
    private data: LeftStickArgs = {
        dir: 0,
        x: 0,
        y: 0,
    };

    render() {
        return html`
    <div class="stick-display">
        <img class=${classMap({arrow: true, hidden: this.data.dir == 0})} style="transform: rotate(${(this.data.dir - 1) * 45}deg)" src="img/arrow.png">
        <div class="circle" style="transform: translate(${this.data.x * 40}px, ${this.data.y * 40}px)" ></div>
        <!-- <p>${this.data.dir}</p> -->
    </div>
    `
    }

    connectedCallback() {
        super.connectedCallback();
        Input.leftStickMove.add(data => {
            this.data = data;
            // console.log(data);
        }, this);
    }

    disconnectedCallback() {
        InputEvent.removeFromAllEvents(this);
        super.disconnectedCallback();
    }
}