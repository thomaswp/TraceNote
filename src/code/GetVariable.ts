import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";

export class GetVariable extends Expression<VarType> {

    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    evaluateInternal(trace: ExecutionTrace): VarType {
        return trace.getVariable(this.name);
    }

    render(): RenderNode {
        return new RenderNode()
            .addVariable(this.name);
    }
}