import { ASTNode } from "./ASTNode";
import { Block } from "./Block";
import { ExecutionTrace } from "./ExecutionTrace";
import { FunctionDefinition } from "./FunctionDefinition";
import { RenderNode } from "./RenderNode";

export class Program extends ASTNode {

    main: Block;
    functions: FunctionDefinition[] = [];

    constructor(main: Block, functions: FunctionDefinition[]) {
        super();
        this.main = main;
        this.functions = functions;
    }

    override render(): RenderNode {
        let r = new RenderNode(this);
        r.useVerticalLayout();
        r.addChild(this.main);
        r.addChildren(this.functions);
        return r;
    }

    override addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        this.functions.forEach(f => f.addToTrace(trace));
        this.main.addToTrace(trace);
    }

}