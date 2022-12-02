import { Block } from "./Block";
import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode, Style } from "./RenderNode";
import { Variable } from "./Variable";

export class ForEachLoop extends Command {

    list: Expression<number[]>;
    variable: Variable<number>;
    block: Block;

    constructor(list: Expression<number[]>, variable: Variable<number>, block: Block) {
        super();
        this.list = list;
        this.variable = variable;
        this.block = block;
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        let list = this.list.evaluate(trace);
        list.forEach((value, index) => {
            trace.startIteration(this, index);
            trace.setVariable(this.variable, value);
            this.block.addToTrace(trace);
            trace.endIteration(this);
        });
        trace.setVariable(this.variable, null);
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addParentheticalCall('For', Style.Control, (r) => {
                r.addVariable(this.variable);
                r.addText(' in ', Style.Control);
                r.addChild(this.list);
            })
            .addChild(this.block);
    }
}