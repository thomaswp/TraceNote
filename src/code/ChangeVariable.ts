import { Command } from "./Command";
import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";
import { VarCategory, Variable } from "./Variable";

export class ChangeVariable extends Command {

    variable: Variable<number>;
    change: Expression<number>;

    constructor(variable: Variable<number>, change: Expression<number>) {
        super();
        this.variable = variable;
        this.change = change;
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        let value = trace.getVariable(this.variable);
        value += this.change.evaluate(trace);
        if (this.variable.type == VarCategory.Bool) value %= 2
        trace.setVariable(this.variable, value);
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addVariable(this.variable)
            .addChange(this.change);
    }
}