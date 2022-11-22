import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { FunctionDefinition } from "./FunctionDefinition";
import { RenderNode } from "./RenderNode";

export class FunctionCall extends Expression<any> {

    name: string;
    args: Expression<any>[];

    constructor(name: string, ...args: Expression<any>[]) {
        super();
        this.name = name;
        this.args = args;
    }

    protected evaluateInternal(trace: ExecutionTrace) {
        let f = trace.getFunction(this.name);
        if (!f) return null;
        return f.call(trace, this.args.map(a => a.evaluate(trace)));
    }

    render(): RenderNode {
        return new RenderNode(this).addCall(this.name, ...this.args);
    }



}