import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";
import { Variable } from "./Variable";

export class GetVariable<T extends VarType> extends Expression<T> {

    variable: Variable<T>;

    constructor(variable: Variable<T>) {
        super();
        this.variable = variable;
    }

    evaluateInternal(trace: ExecutionTrace): T {
        return <T>trace.getVariable(this.variable);
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addVariable(this.variable);
    }
}