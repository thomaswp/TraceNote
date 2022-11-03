import { ASTNode } from "./ASTNode";
import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";
import { RenderNode } from "./RenderNode";

export class Block extends ASTNode {

    commands: Command[];

    constructor(...commands: Command[]) {
        super();
        this.commands = commands;
    }

    addCommand(command: Command): Block {
        this.commands.push(command);
        return this;
    }

    addToTrace(trace: ExecutionTrace): void {
        this.commands.forEach(c => c.addToTrace(trace));
    }

    render(): RenderNode {
        return new RenderNode(this)
            .useVerticalLayout()
            .addChildren(this.commands);
    }
}