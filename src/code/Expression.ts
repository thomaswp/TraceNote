import { ASTNode } from "./ASTNode";
import { ExecutionTrace } from "./ExecutionTrace";

export abstract class Expression<T> extends ASTNode {

    evaluate(trace: ExecutionTrace): T {
        this.addToTrace(trace);
        return this.evaluateInternal(trace);
    }

    protected abstract evaluateInternal(trace: ExecutionTrace): T;
}