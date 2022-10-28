import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";

export class Strum extends Command {

    root: Expression<number>;

    constructor(root: Expression<number>) {
        super();
        this.root = root;
    }

    addToTrace(trace: ExecutionTrace) {
        super.addToTrace(trace);
        trace.strum(this.root.evaluate(trace));
    }

    render(): RenderNode {
        return new RenderNode()
            .addCall('Strum', this.root);
    }
}