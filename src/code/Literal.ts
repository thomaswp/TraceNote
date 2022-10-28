import { VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";

export class Literal<T extends VarType> extends Expression<T> {

    value: T;

    constructor(value: T) {
        super();
        this.value = value;
    }

    evaluateInternal(): T {
        return this.value;
    }

    render(): RenderNode {
        return new RenderNode()
            .addLiteral(this.value);
    }
}