import { ExecutionTrace } from "./ExecutionTrace";
import { RenderNode } from "./RenderNode";
import { v4 as uuidv4 } from 'uuid';

export abstract class ASTNode {

    id: string;

    constructor() {
        this.id = uuidv4();
    }

    addToTrace(trace: ExecutionTrace) {
        trace.run(this);
    }

    abstract render(): RenderNode;
}