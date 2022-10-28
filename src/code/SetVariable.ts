import { Command } from "./Command";
import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";

export class SetVariable extends Command {

    name: string;
    value: Expression<VarType>;

    constructor(name: string, value: Expression<VarType>) {
        super();
        this.name = name;
        this.value = value;
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        trace.setVariable(this.name, this.value.evaluate(trace));
    }
}