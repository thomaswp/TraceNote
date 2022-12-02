import { ExpressionLike, toExpression } from "./CodeUtils";
import { Command } from "./Command";
import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { LiteralType } from "./Literal";
import { RenderNode, Style } from "./RenderNode";
import { Variable } from "./Variable";

export class SetListItem extends Command {

    list: Variable<number[]>;
    index: Expression<number>;
    value: Expression<number>;

    constructor(list: Variable<number[]>, index: ExpressionLike<number>,  value: ExpressionLike<number>) {
        super();
        this.list = list;
        this.index = toExpression(index, LiteralType.Number);
        this.value = toExpression(value);
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        let currentList = trace.getVariable(this.list);
        let newList = currentList.slice();
        let value = this.value.evaluate(trace);
        newList[this.index.evaluate(trace) - 1] = value;
        trace.setVariable(this.list, newList);
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addVariable(this.list)
            .addText('[', Style.Syntax)
            .addChild(this.index)
            .addText('] = ', Style.Syntax)
            .addChild(this.value);
    }
}