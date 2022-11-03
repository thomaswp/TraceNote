import { Block } from "./Block";
import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";

export class Repeat extends Command {

    times: Expression<number>;
    block: Block;

    constructor(times: Expression<number>, block: Block) {
        super();
        this.times = times;
        this.block = block;
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        let nTimes = this.times.evaluate(trace);
        for (let i = 1; i <= nTimes; i++) {
            trace.startIteration(this, i);
            this.block.addToTrace(trace);
            trace.endIteration(this);
        }
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addControl('Repeat', this.times)
            .addChild(this.block);
    }
}