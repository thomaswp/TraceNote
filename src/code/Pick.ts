import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";

export class Pick extends Command {

    note: Expression<number>;

    constructor(note: Expression<number>) {
        super();
        this.note = note;
    }

    addToTrace(trace: ExecutionTrace) {
        super.addToTrace(trace);
        trace.pick(this.note.evaluate(trace));
    }
}