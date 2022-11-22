import { ASTNode } from "./ASTNode";
import { Block } from "./Block";
import { ExecutionTrace } from "./ExecutionTrace";
import { Expression } from "./Expression";
import { GetVariable } from "./GetVariable";
import { RenderNode } from "./RenderNode";
import { Variable } from "./Variable";

export class FunctionDefinition extends ASTNode {

    name: string;
    parameters: Variable<any>[] = [];
    definition: Block;

    constructor(name: string, parameters: Variable<any>[], definition: Block) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.definition = definition;
    }

    override addToTrace(trace: ExecutionTrace): void {
        trace.defineFunction(this);
    }

    call(trace: ExecutionTrace, args: any[]) {
        if (args.length != this.parameters.length) {
            console.error('Incorrect number of parameters for function', this, args, this.parameters);
            return;
        }
        for (let i = 0; i < this.parameters.length; i++) {
            // TODO: Add scope
            // console.log('setting: ', this.parameters[i], args[i])
            trace.setVariable(this.parameters[i], args[i]);
        }
        this.definition.addToTrace(trace);
        // TODO: Add return
        return null;
    }

    render(): RenderNode {
        return new RenderNode(this)
            .addNewline()
            .addFunctionDef(this.name, ...this.parameters.map(v => new GetVariable(v)))
            .addChild(this.definition);
    }

}