import { Expression } from "./Expression";

export class Literal<T> extends Expression<T> {

    value: T;

    constructor(value: T) {
        super();
        this.value = value;
    }

    evaluateInternal(): T {
        return this.value;
    }
}