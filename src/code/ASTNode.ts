import { ExecutionTrace } from "./ExecutionTrace";
import { RenderNode } from "./RenderNode";

export abstract class ASTNode {

    addToTrace(trace: ExecutionTrace) {
        trace.run(this);
    }

    abstract render(): RenderNode;
}