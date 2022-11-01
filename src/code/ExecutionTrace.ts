import { ASTNode } from "./ASTNode";
import { Variable } from "./Variable";

export type VarType = number | boolean;

export class ExecutionTrace {
    data: ExecutionData[]
    varMap: Map<string, VarType>;

    constructor() {
        this.clear();
    }

    clear() {
        this.data = [];
        this.varMap = new Map();
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
        this.data.push({
            type: 'UpdateVar',
            name: variable.name,
            value: value,
        } as UpdateVarData)
    }

    run(node: ASTNode) {
        this.data.push({
            type: 'Run',
            node: node,
        } as RunData);
    }

    strum(root: number) {
        this.data.push({
            type: 'PlayChord',
            root: root,
        } as PlayChordData);
    }

    pick(note: number) {
        this.data.push({
            type: 'PlayNote',
            note: note,
        } as PlayNoteData);
    }
}

export interface ExecutionData {
    type: string;
}

export interface RunData extends ExecutionData {
    node: ASTNode;
}

export interface PlayChordData extends ExecutionData {
    root: number;
}

export interface PlayNoteData extends ExecutionData {
    note: number;
}

export interface UpdateVarData extends ExecutionData {
    name: string;
    value: VarType;
}