import { ASTNode } from "./ASTNode";
import { VarType } from "./ExecutionTrace";

export interface StyledText {
    content: string,
    style: Style,
}

export type Line = StyledText[];

export enum Style {
    Default,
    Syntax,
    Control,
    Literal,
    Variable,
    Call,
}

export class RenderNode {

    private content = [] as Line;
    private children = [] as RenderNode[];

    toString(tabs = ''): string {
        return tabs + this.content.map(c => c.content).join('') +
            // (this.children.length > 0 ? '\n' : '') +
            this.children.map(r => r.toString(tabs + '\t')).join('\n');
    }

    private addText(content: string, style: Style) {
        this.content.push({content, style});
        return this;
    }

    private addChildText(node: ASTNode) {
        this.content = this.content.concat(node.render().content);
        return this;
    }

    private addChild(node: ASTNode): RenderNode {
        // console.log(node);
        this.children.push(node.render());
        return this;
    }

    addChildren(nodes: ASTNode[]): RenderNode {
        nodes.forEach(n => this.addChild(n));
        return this;
    }

    addLiteral(value: VarType): RenderNode {
        return this.addText("" + value, Style.Literal);
    }

    addVariable(name: string): RenderNode {
        // TODO: Add Image
        return this.addText(name, Style.Variable);
    }


    private addCallLike(text: string, style: Style, args: ASTNode[]) {
        this.addText(text, style);
        this.addText('(', Style.Syntax);
        let first = true;
        args.forEach(a => {
            this.addChildText(a);
            if (!first) this.addText(',', Style.Syntax);
            first = false;
        });
        this.addText(')', Style.Syntax);
        return this;
    }

    addControl(text: string, ...args: ASTNode[]) {
        return this.addCallLike(text, Style.Control, args);
    }

    addCall(text: string, ...args: ASTNode[]) {
        return this.addCallLike(text, Style.Call, args);
    }

    addSet(name: string, value: ASTNode) {
        // TODO: Add Image
        this.addText(name, Style.Variable);
        this.addText(' = ', Style.Syntax);
        this.addChildText(value);
        return this;
    }

    addChange(name: string, change: ASTNode) {
        // TODO: Add Image
        this.addText(name, Style.Variable);
        this.addText(' += ', Style.Syntax);
        // TODO: Child style? How this is rendered depends on context, right?
        this.addChildText(change);
        return this;
    }
}