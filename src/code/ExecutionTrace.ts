import { ASTNode } from "./ASTNode";

export type VarType = number;

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

    getVariable(name: string): VarType {
        if (!this.varMap.has(name)) {
            console.error("Undefined variable!", name);
            return 0;
        }
        return this.varMap.get(name);
    }

    setVariable(name: string, value: VarType) {
        this.varMap.set(name, value);
        this.data.push({
            type: 'UpdateVar',
            name: name,
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