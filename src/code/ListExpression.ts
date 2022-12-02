import { ExpressionLike, toExpression } from "./CodeUtils";
import { ExecutionTrace, VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { LiteralType } from "./Literal";
import { RenderNode, Style } from "./RenderNode";

export class ListExpression extends Expression<number[]> {

    values: Expression<number>[];

    constructor(values: ExpressionLike<number>[], literalType?: LiteralType) {
        super();
        this.values = values.map(v => toExpression(v, literalType));
    }

    protected evaluateInternal(trace: ExecutionTrace): number[] {
        return this.values.map(v => v.evaluate(trace));
    }

    render(): RenderNode {
        let node = new RenderNode(this);
        node.addText('[', Style.Syntax);
        this.values.forEach((v, index) => {
            if (index > 0) node.addText(', ', Style.Syntax);
            node.addChild(v);
        });
        node.addText(']', Style.Syntax);
        return node;
    }

}