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
    // TODO: This seems problematic - how can I ensure values have a type to display properly
    // so that we're only using the variable's type to determine its icon, and not it's data's type
    ListRotation = 'list-rotation',
    ListNumber = 'list-number',
}

export const Bool1Var = new Variable<boolean>(VarCategory.Bool, 'green');
export const Bool2Var = new Variable<boolean>(VarCategory.Bool, 'blue');
export const Bool3Var = new Variable<boolean>(VarCategory.Bool, 'red');

export const Note1Var = new Variable<number>(VarCategory.Note, 'green');
export const Note2Var = new Variable<number>(VarCategory.Note, 'blue');
export const Note3Var = new Variable<number>(VarCategory.Note, 'red');

export const List1Var = new Variable<number[]>(VarCategory.ListRotation, 'horizontal');
export const List2Var = new Variable<number[]>(VarCategory.ListRotation, 'vertical');