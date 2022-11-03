import { VarType } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { RenderNode } from "./RenderNode";

export enum LiteralType {
    Number,
    Boolean,
    Rotation,
    RotationChange,
}

export class Literal<T extends VarType> extends Expression<T> {

    value: T;
    type: LiteralType;

    constructor(value: T, type = LiteralType.Rotation) {
        super();
        this.value = value;
        this.type = type;
    }

    evaluateInternal(): T {
        return this.value;
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addLiteral(this.value, this.type);
    }
}

export class NumberLiteral extends Literal<number> {
    constructor(value: number) {
        super(value, LiteralType.Number);
    }
}

export class BooleanLiteral extends Literal<boolean> {
    constructor(value: boolean) {
        super(value, LiteralType.Boolean);
    }
}