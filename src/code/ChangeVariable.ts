import { Command } from "./Command";
import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";

export class ChangeVariable extends Command {

    name: string;
    change: Expression<VarType>;

    constructor(name: string, change: Expression<VarType>) {
        super();
        this.name = name;
        this.change = change;
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        let value = trace.getVariable(this.name);
        value += this.change.evaluate(trace);
        trace.setVariable(this.name, value);
    }
}