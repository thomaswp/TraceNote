import { ASTNode } from "./ASTNode";
import { VarType } from "./ExecutionTrace";
import { Literal, LiteralType } from "./Literal";
import { VarCategory, Variable } from "./Variable";


export interface Renderable {
    toString(tabs: string, addHTML: boolean);
    hasVerticalLayout(): boolean;
}

// TODO: Could definitely dediplicate some code w/ these classes...
export class StyledText implements Renderable {
    content: string;
    style: Style;

    constructor(content: string, style: Style) {
        this.content = content;
        this.style = style;
    }

    toString(tabs: string, addHTML: boolean) {
        if (addHTML) return this.htmlWrap(this.content);
        return this.content;
    }

    hasVerticalLayout(): boolean {
        return false;
    }


    htmlWrap(content: string) {
        let span = document.createElement('span');
        span.innerHTML = content;
        span.classList.add('code');
        span.classList.add('text');
        span.classList.add(this.style.toString());
        return span.outerHTML;
    }
}

export class VariableLayout implements Renderable {
    name: string;
    color: string;
    type: string;

    constructor(variable: Variable<any>) {
        this.name = variable.name;
        this.color = variable.color;
        this.type = variable.type;
    }

    toString(tabs: string, addHTML: boolean) {
        if (!addHTML) return this.name;
        let span = document.createElement('span');
        const map = {
            'green_note': '\u{1F7E2}',
            'green_bool': '\u{1F7E9}',
        }
        let key =  this.color + '_' + this.type;
        if (!map[key]) console.error('Unknown key', key);
        span.innerHTML = map[key];
        span.classList.add('code');
        span.classList.add('variable');
        return span.outerHTML;

    }

    hasVerticalLayout(): boolean {
        return false;
    }
}

export class RotationLayout implements Renderable {
    value: number

    constructor(value: number) {
        this.value = value;
    }

    toString(tabs: string, addHTML: boolean) {
        if (!addHTML) return "" + this.value;
        let span = document.createElement('span');
        const chars = ['\u{2192}', '\u{2198}', '\u{2193}', '\u{2199}', '\u{2190}', '\u{2196}', '\u{2191}', '\u{2197}'];
        let key = (this.value - 1) % chars.length;
        if (!chars[key]) console.error('Unknown number value', this.value);
        span.innerHTML = chars[key];
        span.classList.add('code');
        span.classList.add('literal');
        span.classList.add('number');
        return span.outerHTML;

    }

    hasVerticalLayout(): boolean {
        return false;
    }
}

export class BooleanLayout implements Renderable {
    value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    toString(tabs: string, addHTML: boolean) {
        if (!addHTML) return "" + this.value;
        let span = document.createElement('span');
        span.innerHTML = this.value ? '\u{2611}' : '\u{2612}'
        span.classList.add('code');
        span.classList.add('literal');
        span.classList.add('boolean');
        return span.outerHTML;

    }

    hasVerticalLayout(): boolean {
        return false;
    }
}

export class RotationChangeLayout implements Renderable {
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    toString(tabs: string, addHTML: boolean) {
        if (!addHTML) return " += " + this.value;
        let span = document.createElement('span');
        let char = this.value > 0 ? '\u{2B6E}' : '\u{27F2}'
        for (let i = 0; i < Math.abs(this.value); i++) {
            span.innerHTML += char;
        }
        span.classList.add('code');
        span.classList.add('change');
        return span.outerHTML;

    }

    hasVerticalLayout(): boolean {
        return false;
    }
}

export type Line = StyledText[];

export enum Style {
    Default = 'default',
    Syntax = 'syntax',
    Control = 'control',
    Literal = 'literal',
    Variable = 'variable',
    Call = 'call',
}

export class RenderNode implements Renderable {

    parent: ASTNode;

    readonly children = [] as Renderable[];
    private verticalLayout = false;

    constructor(parent: ASTNode) {
        this.parent = parent;
    }

    toString(tabs = '', addHTML = false): string {
        let content;
        if (this.hasVerticalLayout()) {
            let nextTabs = '  ' + tabs;
            content = this.children.map(r => r.toString(nextTabs, addHTML)).join('\n' + tabs);
        } else {
            let lastVertical = false;
            content = this.children.map((r, index) => {
                let ts = r.toString(tabs, addHTML);
                if (r.hasVerticalLayout()) {
                    let value = ':';
                    if (r instanceof RenderNode) { // && r.children.length > 1) {
                        value += '\n' + tabs + ts;
                    } else {
                        value += ' ' + ts;
                    }
                    lastVertical = true;
                    return value;
                } else {
                    let r = '';
                    if (lastVertical) r += '\n' + tabs.substring(2);
                    r += ts;
                    lastVertical = false;
                    return r;
                }
            }).join('');
        }
        if (addHTML) return this.htmlWrap(content);
        return content;
    }

    htmlWrap(content: string) {
        let span = document.createElement('span');
        span.id = this.parent.id;
        span.innerHTML = content;
        span.classList.add('code');
        span.classList.add('node');
        span.classList.toggle('vertical', this.hasVerticalLayout());
        return span.outerHTML;
    }

    private addText(content: string, style: Style) {
        this.children.push(new StyledText(content, style));
        return this;
    }

    hasVerticalLayout(): boolean {
        return this.verticalLayout; // && this.children.length > 1;
    }

    useVerticalLayout() {
        this.verticalLayout = true;
        return this;
    }

    addChild(node: ASTNode): RenderNode {
        this.children.push(node.render());
        return this;
    }

    private addRenderable(r: Renderable): RenderNode {
        this.children.push(r);
        return this;
    }

    addChildren(nodes: ASTNode[]): RenderNode {
        nodes.forEach(n => this.addChild(n));
        return this;
    }

    addLiteral(value: VarType, type: LiteralType): RenderNode {
        if (type == LiteralType.Rotation) {
            return this.addRenderable(new RotationLayout(<number>value));
        } else if (type == LiteralType.Boolean) {
            return this.addRenderable(new BooleanLayout(<boolean>value));
        } else if (type == LiteralType.RotationChange) {
            return this.addRenderable(new RotationChangeLayout(<number>value));
        } else {
            return this.addText('' + value, Style.Literal);
        }
    }

    private addCallLike(text: string, style: Style, addZeroArgsParens: boolean,  args: ASTNode[]) {
        this.addText(text, style);
        if (!addZeroArgsParens && args.length == 0) return this;
        this.addText(' ', Style.Syntax);
        this.addText('(', Style.Syntax);
        let first = true;
        args.forEach(a => {
            this.addChild(a);
            if (!first) this.addText(',', Style.Syntax);
            first = false;
        });
        this.addText(')', Style.Syntax);
        return this;
    }

    addControl(text: string, ...args: ASTNode[]) {
        return this.addCallLike(text, Style.Control, false, args);
    }

    addCall(text: string, ...args: ASTNode[]) {
        return this.addCallLike(text, Style.Call, true, args);
    }

    addVariable(variable: Variable<any>): RenderNode {
        return this.addRenderable(new VariableLayout(variable));
    }

    addSet(variable: Variable<any>, value: ASTNode) {
        this.addRenderable(new VariableLayout(variable));
        this.addText(' = ', Style.Syntax);
        this.addChild(value);
        return this;
    }

    addChange(variable: Variable<any>, change: ASTNode) {
        this.addRenderable(new VariableLayout(variable));
        if (change instanceof Literal) {
            this.addRenderable(new RotationChangeLayout(change.value));
        } else {
            // TODO: This rendering actually depends on HTML vs not..
            console.error('Unsure how to render change.');
            this.addText(' += ', Style.Syntax);
            this.addChild(change);
        }
        return this;
    }
}