import { ASTNode } from "./ASTNode";
import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";

export abstract class Expression<T> extends Command {

    addToTrace(trace: ExecutionTrace): void {
        this.evaluate(trace);
    }

    evaluate(trace: ExecutionTrace): T {
        super.addToTrace(trace);
        return this.evaluateInternal(trace);
    }

    protected abstract evaluateInternal(trace: ExecutionTrace): T;
}