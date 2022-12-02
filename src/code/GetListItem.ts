import { ExpressionLike, toExpression } from "./CodeUtils";
import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { LiteralType } from "./Literal";
import { RenderNode, Style } from "./RenderNode";

export class GetListItem extends Expression<number> {

    index: Expression<number>;
    list: Expression<number[]>;

    constructor(list: ExpressionLike<number[]>, index: ExpressionLike<number>) {
        super();
        this.list = toExpression(list);
        this.index = toExpression(index, LiteralType.Number);
    }

    protected override evaluateInternal(trace: ExecutionTrace): number {
        // TODO: Do I want 0- or 1-indexed?
        return this.list.evaluate(trace)[this.index.evaluate(trace) - 1];
    }


    render(): RenderNode {
        return new RenderNode(this)
            .addChild(this.list)
            .addText('[', Style.Syntax)
            .addChild(this.index)
            .addText(']', Style.Syntax)
    }
}