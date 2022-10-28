import { Block } from "../code/Block";
import { ChangeVariable } from "../code/ChangeVariable";
import { ExecutionTrace } from "../code/ExecutionTrace";
import { GetVariable } from "../code/GetVariable";
import { Literal } from "../code/Literal";
import { Pick } from "../code/Pick";
import { Repeat } from "../code/Repeat";
import { SetVariable } from "../code/SetVariable";
import { Strum } from "../code/Strum";

export enum BoolVars {
    Green = "bool_green",
    Red = "bool_red",
    Blue = "bool_blue",
}

export enum NoteVars {
    Green = "note_green",
    Red = "note_red",
    Blue = "note_blue",
}

export interface Level {

    name: string;
    getCode(): Block;
}

export const levels = [] as Level[];

levels.push(new class implements Level {
    name = "Strum Basics";

    getCode(): Block {
        return new Block()
            .addCommand(new Strum(new Literal(1)))
            .addCommand(new Strum(new Literal(3)))
            .addCommand(new Strum(new Literal(5)))
            .addCommand(new Strum(new Literal(1)))
        ;
    }
})

levels.push(new class implements Level {

    name = "Basic Repeat";

    getCode(): Block {
        return new Block()
            .addCommand(new Repeat(new Literal(4),
                new Block()
                .addCommand(new Strum(new Literal(1)))
                .addCommand(new Strum(new Literal(3)))
                .addCommand(new Strum(new Literal(5)))
                .addCommand(new Strum(new Literal(1)))
            )
        );
    }
});

levels.push(new class implements Level {

    name = "Half Scale 1";

    getCode(): Block {
        let block = new Block();
        for (let note = 1; note <= 4; note++) {
            block.addCommand(new SetVariable(NoteVars.Green, new Literal(note)));
            block.addCommand(new Pick(new GetVariable(NoteVars.Green)));
        }
        return block;
    }
});

levels.push(new class implements Level {

    name = "Half Scale 2";

    getCode(): Block {
        let block = new Block();
        block.addCommand(new SetVariable(NoteVars.Green, new Literal(1)));
        block.addCommand(new Pick(new GetVariable(NoteVars.Green)));
        for (let note = 2; note <= 4; note++) {
            block.addCommand(new ChangeVariable(NoteVars.Green, new Literal(1)));
            block.addCommand(new Pick(new GetVariable(NoteVars.Green)));
        }
        return block;
    }
});

levels.push(new class implements Level {

    name = "Arpeggio 2";

    getCode(): Block {
        return new Block()
            .addCommand(new SetVariable(NoteVars.Green, new Literal(1)))
            .addCommand(new Pick(new GetVariable(NoteVars.Green)))
            .addCommand(new ChangeVariable(NoteVars.Green, new Literal(2)))
            .addCommand(new Pick(new GetVariable(NoteVars.Green)))
            .addCommand(new ChangeVariable(NoteVars.Green, new Literal(2)))
            .addCommand(new Pick(new GetVariable(NoteVars.Green)))
            .addCommand(new ChangeVariable(NoteVars.Green, new Literal(3)))
            .addCommand(new Pick(new GetVariable(NoteVars.Green)))
        ;
    }
});

levels.push(new class implements Level {

    name = "Half Scale Down";

    getCode(): Block {
        let block = new Block();
        block.addCommand(new SetVariable(NoteVars.Green, new Literal(4)));
        block.addCommand(new Pick(new GetVariable(NoteVars.Green)));
        for (let note = 2; note <= 4; note++) {
            block.addCommand(new ChangeVariable(NoteVars.Green, new Literal(-1)));
            block.addCommand(new Pick(new GetVariable(NoteVars.Green)));
        }
        return block;
    }
});

export function test() {
    levels.forEach(level => {
        console.log('Level', level.name);
        let code = level.getCode();
        console.log('Code', code);
        let trace = new ExecutionTrace();
        code.addToTrace(trace);
        console.log('Trace', trace);
    })
}