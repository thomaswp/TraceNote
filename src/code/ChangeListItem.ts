import { ExpressionLike, toExpression } from "./CodeUtils";
import { Command } from "./Command";
import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { LiteralType } from "./Literal";
import { RenderNode, Style } from "./RenderNode";
import { VarCategory, Variable } from "./Variable";

export class ChangeListItem extends Command {

    list: Variable<number[]>;
    index: Expression<number>;
    change: Expression<number>;

    constructor(list: Variable<number>, index: ExpressionLike<number>, change: ExpressionLike<number>) {
        super();
        this.list = list;
        this.index = toExpression(index, LiteralType.Number);
        this.change = toExpression(change, LiteralType.RotationChange);
    }

    addToTrace(trace: ExecutionTrace): void {
        super.addToTrace(trace);
        let currentList = trace.getVariable(this.list);
        let index = this.index.evaluate(trace) - 1;
        let newList = currentList.slice();
        newList[index] += this.change.evaluate(trace);
        trace.setVariable(this.list, newList);
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addVariable(this.list)
            .addText('[', Style.Syntax)
            .addChild(this.index)
            .addText(']', Style.Syntax)
            .addChange(this.change);
    }
}