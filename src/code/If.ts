import { Block } from "./Block";
import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";

export class If extends Command {

    condition: Expression<boolean>;
    thenBlock: Block;
    elseBlock?: Block;

    constructor(condition: Expression<boolean>, thenBlock: Block, elseBlock?: Block) {
        super();
        this.condition = condition;
        this.thenBlock = thenBlock;
        this.elseBlock = elseBlock;
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        let test = this.condition.evaluate(trace);
        if (test) {
            this.thenBlock.addToTrace(trace);
        } else if (this.elseBlock) {
            this.elseBlock.addToTrace(trace);
        }
    }

    render(): RenderNode {
        let result = new RenderNode()
            .addControl('If', this.condition)
            .addChild(this.thenBlock);

        if (this.elseBlock) {
            result = result.addControl('Else')
                .addChild(this.elseBlock);
        }
        return result;
    }

}