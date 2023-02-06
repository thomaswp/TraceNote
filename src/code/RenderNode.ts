import { ASTNode } from "./ASTNode";
import { VarType } from "./ExecutionTrace";
import { Literal, LiteralType } from "./Literal";
import { VarCategory, Variable } from "./Variable";


export interface Renderable {
    toString(tabs: string, addHTML: boolean);
    hasVerticalLayout(): boolean;
}

abstract class SpanRenderable implements Renderable {

    createSpan() {
        let span = document.createElement('span');
        span.classList.add('code');
        return span;
    }

    hasVerticalLayout(): boolean {
        return false;
    }

}

// TODO: Could definitely dediplicate some code w/ these classes...
export class StyledText extends SpanRenderable {
    content: string;
    style: Style;

    constructor(content: string, style: Style) {
        super();
        this.content = content;
        this.style = style;
    }

    toString(tabs: string, addHTML: boolean) {
        if (addHTML) return this.htmlWrap(this.content);
        return this.content;
    }

    htmlWrap(content: string) {
        let span = this.createSpan();
        span.innerHTML = content;
        span.classList.add('text');
        span.classList.add(this.style.toString());
        return span.outerHTML;
    }
}

export class VariableLayout extends SpanRenderable {
    name: string;
    color: string;
    type: string;

    constructor(variable: Variable<any>) {
        super();
        this.name = variable.name;
        this.color = variable.color;
        this.type = variable.type;
    }

    toString(tabs: string, addHTML: boolean) {
        if (!addHTML) return this.name;
        let span = this.createSpan();
        const map = {
            'green_note': '\u{1F7E2}',
            'blue_note': '\u{1F535}',
            'green_bool': '\u{1F7E9}',
            'horizontal_list-rotation': '\u{25A4}',
            'vertical_list-rotation': '\u{25A5}',
        }
        let key =  this.color + '_' + this.type;
        if (!map[key]) console.error('Unknown key', key);
        span.innerHTML = map[key];
        span.classList.add('variable');
        return span.outerHTML;

    }
}

abstract class LiteralRenderable<T> extends SpanRenderable {
    value: T;
    classes: string[];

    constructor(value: T, ...classes: string[]) {
        super();
        this.value = value;
        this.classes = classes;
    }

    abstract getInnerHTML(): string;

    toString(tabs: string, addHTML: boolean) {
        if (!addHTML) return "" + this.value;
        let span = this.createSpan();
        span.innerHTML = this.getInnerHTML();
        span.classList.add('literal');
        this.classes.forEach(c => span.classList.add(c));
        return span.outerHTML;
    }
}

export class RotationLayout extends LiteralRenderable<number> {

    constructor(value: number) {
        super(value, 'number');
    }

    getInnerHTML(): string {
        const chars = ['\u{2192}', '\u{2198}', '\u{2193}', '\u{2199}', '\u{2190}', '\u{2196}', '\u{2191}', '\u{2197}'];
        let key = (this.value - 1) % chars.length;
        if (!chars[key]) console.error('Unknown number value', this.value);
        return chars[key];
    }
}

export class BooleanLayout extends LiteralRenderable<boolean> {

    constructor(value: boolean) {
        super(value, 'boolean');
    }

    getInnerHTML(): string {
        return this.value ? '\u{2611}' : '\u{2612}'

    }
}

export class RotationChangeLayout extends LiteralRenderable<number> {

    constructor(value: number) {
        super(value, 'change');
    }

    getInnerHTML(): string {
        let text = '';
        let char = this.value > 0 ? '\u{2B6E}' : '\u{27F2}'
        for (let i = 0; i < Math.abs(this.value); i++) {
            text += char;
        }
        return text;
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
            // Nested vertical blocks shouldn't double-indent
            content = this.children.map(r => r.toString(r.hasVerticalLayout() ? tabs : nextTabs, addHTML)).join('\n' + tabs);
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
        // TODO: Add optional class for each type of parent
        // e.g. so Blocks can prevent opacity passing
        span.classList.toggle('vertical', this.hasVerticalLayout());
        return span.outerHTML;
    }

    addText(content: string, style: Style) {
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

    addParentheticalCall(text: string, style: Style, middle: (node: RenderNode) => void) {
        this.addText(text, style);
        this.addText(' ', Style.Syntax);
        this.addText('(', Style.Syntax);
        middle(this);
        this.addText(')', Style.Syntax);
        return this;
    }

    private addCallLike(text: string, style: Style, args: ASTNode[]) {
        return this.addParentheticalCall(text, style, (r) => {
            let first = true;
            args.forEach(a => {
                if (!first) r.addText(',', Style.Syntax);
                r.addChild(a);
                first = false;
            });
        });
    }

    addControl(text: string, ...args: ASTNode[]) {
        return this.addCallLike(text, Style.Control, args);
    }

    addCall(text: string, ...args: ASTNode[]) {
        return this.addCallLike(text, Style.Call, args);
    }

    addFunctionDef(name: string, ...args: ASTNode[]) {
        this.addText('Function ', Style.Control)
        return this.addCallLike(name, Style.Call, args);
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

    addChange(change: ASTNode) {
        if (change instanceof Literal) {
            let amount = new RenderNode(change);
            amount.addRenderable(new RotationChangeLayout(change.value));
            this.addRenderable(amount);
        } else {
            // TODO: This rendering actually depends on HTML vs not..
            console.error('Unsure how to render change.');
            this.addText(' += ', Style.Syntax);
            this.addChild(change);
        }
        return this;
    }

    addNewline(): RenderNode {
        return this.addText('\n', Style.Syntax);
    }
}