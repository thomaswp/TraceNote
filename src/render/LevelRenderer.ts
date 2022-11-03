import { RenderNode, StyledText } from "../code/RenderNode";
import { Level } from "../levels/Levels";
import {LitElement, html, css, render} from 'lit';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import "./LevelControls";
import { LevelControls } from "./LevelControls";

export class LevelRenderer {

    level: Level;

    constructor(level: Level) {
        this.level = level;
    }

    render() : HTMLElement {

        let code = this.level.getCode();
        let node = code.render();

        let c = html`
            <div class="code-container">
                <div class="code-content">${unsafeHTML(node.toString('', true))}</div>
                <!-- <test-comp/> -->
            </div>
        `;

        let container = document.createElement('div');
        // render(c, container);
        let lc = document.createElement('level-controls') as LevelControls;
        lc.level = this.level;
        container.appendChild(lc);


        return container;


        // let content = document.createElement('div');
        // content.innerHTML = node.toString('', true);
        // content.classList.add('code-content');

        // let container = document.createElement('div');
        // container.appendChild(content);
        // container.classList.add('code-container');

        // container.appendChild(document.createElement('test-comp'));

        // let t = new TestComponent();
        // let s = html`blah`;

        // return container;
    }

}