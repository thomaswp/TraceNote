import { ASTNode } from "./ASTNode";
import { FunctionDefinition } from "./FunctionDefinition";
import { Variable } from "./Variable";

export type VarType = number | boolean;

export class ExecutionTrace {
    data: ExecutionData[]
    varMap: Map<string, VarType>;
    functionMap: Map<string, FunctionDefinition>;

    constructor() {
        this.clear();
    }

    clear() {
        this.data = [];
        this.varMap = new Map();
        this.functionMap = new Map();
    }

    startIteration(node: ASTNode, i: number) {
        // TODO
    }

    endIteration(node: ASTNode) {
        // TODO
    }

    getVariable<T extends VarType>(variable: Variable<T>): T {
        if (!this.varMap.has(variable.name)) {
            console.error("Undefined variable!", variable);
            return <T>0;
        }
        return <T>this.varMap.get(variable.name);
    }

    setVariable<T extends VarType>(variable: Variable<T>, value: T) {
        this.varMap.set(variable.name, value);
        this.data.push(new UpdateVarData(variable.name, value));
    }

    defineFunction(def: FunctionDefinition) {
        this.functionMap.set(def.name, def);
    }

    getFunction(name: string) {
        if (!this.functionMap.has(name)) {
            console.error("Undefined function!", name);
            return null;
        }
        return this.functionMap.get(name);
    }

    run(node: ASTNode) {
        this.data.push(new RunData(node));
    }

    strum(root: number) {
        this.data.push(new PlayChordData(root));
    }

    pick(note: number) {
        this.data.push(new PlayNoteData(note));
    }
}

export abstract class ExecutionData {
    isBlocking(): boolean {
        return false;
    }
}

export class RunData extends ExecutionData {
    node: ASTNode;

    constructor(node: ASTNode) {
        super();
        this.node = node;
    }
}

export class PlayChordData extends ExecutionData {
    note: number;

    constructor(root: number) {
        super();
        this.note = root;
    }

    isBlocking(): boolean {
        return true;
    }
}

export class PlayNoteData extends ExecutionData {
    note: number;

    constructor(note: number) {
        super();
        this.note = note;
    }

    isBlocking(): boolean {
        return true;
    }
}

export class UpdateVarData extends ExecutionData {
    name: string;
    value: VarType;

    constructor(name: string, value: VarType) {
        super();
        this.name = name;
        this.value = value;
    }
}