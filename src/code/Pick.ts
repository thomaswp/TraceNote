import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";

export class Pick extends Command {

    note: Expression<number>;
    duration: number;

    constructor(note: Expression<number>, duration = 1) {
        super();
        this.note = note;
        this.duration = duration;
    }

    addToTrace(trace: ExecutionTrace) {
        super.addToTrace(trace);
        trace.pick(this.note.evaluate(trace), this.duration);
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addCall('Pick', this.note);
    }
}