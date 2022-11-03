import { Command } from "./Command";
import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";
import { Variable } from "./Variable";

export class SetVariable<T extends VarType> extends Command {

    variable: Variable<T>;
    value: Expression<T>;

    constructor(name: Variable<T>, value: Expression<T>) {
        super();
        this.variable = name;
        this.value = value;
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        trace.setVariable(this.variable, this.value.evaluate(trace));
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addSet(this.variable, this.value);
    }
}