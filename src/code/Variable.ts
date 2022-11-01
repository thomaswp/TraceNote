import { VarType } from "./ExecutionTrace";

export class Variable<T extends VarType> {

    readonly type: VarCategory;
    readonly color: string;

    get name() {
        return this.type + '_' + this.color;
    }

    constructor(type: VarCategory, color: string) {
        this.type = type;
        this.color = color;
    }
}

export enum VarCategory {
    Bool = 'bool',
    Note = 'note',
    Chord = 'chord',
}

export const BoolGreenVar = new Variable<boolean>(VarCategory.Bool, 'green');
export const BoolRedVar = new Variable<boolean>(VarCategory.Bool, 'red');
export const BoolBlueVar = new Variable<boolean>(VarCategory.Bool, 'blue');

export const NoteGreenVar = new Variable<number>(VarCategory.Note, 'green');
export const NoteRedVar = new Variable<number>(VarCategory.Note, 'red');
export const NoteBlueVar = new Variable<number>(VarCategory.Note, 'blue');