import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Input, InputEvent, LeftStickArgs } from '../input/Input';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Level, levelCategories, levelMap, levels } from '../levels/Levels';

@customElement('level-menu')
export class LevelMenu extends LitElement {

    @property()
    selectedLevel: Level;

    createRenderRoot() {
        return this;
    }

    itemSelected(level: Level) {
        let event = new CustomEvent('level-selected', {
            detail: {
                level: level,
            }
        });
        this.dispatchEvent(event);
    }

    render() {
        return html`
<div class="flex-shrink-0 p-3 bg-white" style="width: 230px;">
    <div class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
        <span class="fs-5 fw-semibold">Levels</span>
    </div>
    <ul class="list-unstyled ps-0">
        ${levelCategories.map(cat => {
            let catCss = cat.replace(' ', '-');
            let levels = levelMap.get(cat);
            let selected = levels.includes(this.selectedLevel);
            return html`
        <li class="mb-1">
            <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                data-bs-target="#${catCss}-collapse" aria-expanded=${selected}>
                ${cat}
            </button>
            <div class="collapse ${selected ? "show" : ""}" id="${catCss}-collapse">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    ${levels.map(level => html`
                        <li>
                        <a
                            href="#"
                            class="link-dark rounded ${this.selectedLevel == level ? 'selected' : ''}"
                            @click=${() => this.itemSelected(level)}
                        >${level.name}</a></li>
                    `)}
                </ul>
            </div>
        </li>
        `
          })}
    </ul>
</div>
    `
    }
}