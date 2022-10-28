import { ExecutionTrace } from "./ExecutionTrace";

export abstract class ASTNode {

    addToTrace(trace: ExecutionTrace) {
        trace.run(this);
    }
}