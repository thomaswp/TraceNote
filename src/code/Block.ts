import { ASTNode } from "./ASTNode";
import { Command } from "./Command";
import { ExecutionTrace } from "./ExecutionTrace";

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
}