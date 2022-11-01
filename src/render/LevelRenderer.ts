import { RenderNode, StyledText } from "../code/RenderNode";
import { Level } from "../levels/Levels";

export class LevelRenderer {

    level: Level;

    constructor(level: Level) {
        this.level = level;
    }

    render() : HTMLElement {
        let code = this.level.getCode();
        let node = code.render();
        let div = document.createElement('div');
        div.innerHTML = node.toString('', true);
        div.classList.add('code-container');
        return div;
    }

    // renderNode(node: RenderNode) : HTMLElement {
    //     let contianer = document.createElement('div');
    //     contianer.classList.add('code');
    //     contianer.classList.add('node');
    //     contianer.classList.toggle('vertical', node.hasVerticalLayout());
    //     node.children.forEach(child => {
    //         if (child instanceof StyledText) contianer.appendChild(this.renderText(child));
    //         else if (child instanceof RenderNode) contianer.appendChild(this.renderNode(child));
    //         else {
    //             console.error('Unknown child', child);
    //         }
    //     });
    //     return contianer;

    // }

    // renderText(text: StyledText) : HTMLElement {
    //     let contianer = document.createElement('span');
    //     contianer.innerText = text.content;
    //     contianer.classList.add('code');
    //     contianer.classList.add('text');
    //     contianer.classList.add(text.style.toString());
    //     return contianer;
    // }

}