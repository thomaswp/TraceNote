import { Block } from "../code/Block";
import { ChangeVariable } from "../code/ChangeVariable";
import { ExecutionTrace } from "../code/ExecutionTrace";
import { GetVariable } from "../code/GetVariable";
import { If } from "../code/If";
import { BooleanLiteral, Literal, NumberLiteral } from "../code/Literal";
import { Pick } from "../code/Pick";
import { Repeat } from "../code/Repeat";
import { SetVariable } from "../code/SetVariable";
import { Strum } from "../code/Strum";
import { BoolGreenVar, NoteGreenVar } from "../code/Variable";

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
            .addCommand(new Repeat(new NumberLiteral(4),
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

    name = "Nested Repeat";

    getCode(): Block {
        let block = new Block()
            .addCommand(new Repeat(new NumberLiteral(4), new Block()
                .addCommand(new Strum(new Literal(1)))
                .addCommand(new Repeat(new NumberLiteral(2), new Block()
                    .addCommand(new Strum(new Literal(4)))
                ))
                .addCommand(new Strum(new Literal(5)))
            )
        );
        return block;
    }
});

levels.push(new class implements Level {

    name = "Half Scale 1";

    getCode(): Block {
        let block = new Block();
        for (let note = 1; note <= 4; note++) {
            block.addCommand(new SetVariable(NoteGreenVar, new Literal(note)));
            block.addCommand(new Pick(new GetVariable(NoteGreenVar)));
        }
        return block;
    }
});

levels.push(new class implements Level {

    name = "Half Scale 2";

    getCode(): Block {
        let block = new Block();
        block.addCommand(new SetVariable(NoteGreenVar, new Literal(1)));
        block.addCommand(new Pick(new GetVariable(NoteGreenVar)));
        for (let note = 2; note <= 4; note++) {
            block.addCommand(new ChangeVariable(NoteGreenVar, new Literal(1)));
            block.addCommand(new Pick(new GetVariable(NoteGreenVar)));
        }
        return block;
    }
});

levels.push(new class implements Level {

    name = "Arpeggio 2";

    getCode(): Block {
        return new Block()
            .addCommand(new SetVariable(NoteGreenVar, new Literal(1)))
            .addCommand(new Pick(new GetVariable(NoteGreenVar)))
            .addCommand(new ChangeVariable(NoteGreenVar, new Literal(2)))
            .addCommand(new Pick(new GetVariable(NoteGreenVar)))
            .addCommand(new ChangeVariable(NoteGreenVar, new Literal(2)))
            .addCommand(new Pick(new GetVariable(NoteGreenVar)))
            .addCommand(new ChangeVariable(NoteGreenVar, new Literal(3)))
            .addCommand(new Pick(new GetVariable(NoteGreenVar)))
        ;
    }
});

levels.push(new class implements Level {

    name = "Half Scale Down";

    getCode(): Block {
        let block = new Block();
        block.addCommand(new SetVariable(NoteGreenVar, new Literal(4)));
        block.addCommand(new Pick(new GetVariable(NoteGreenVar)));
        for (let note = 2; note <= 4; note++) {
            block.addCommand(new ChangeVariable(NoteGreenVar, new Literal(-1)));
            block.addCommand(new Pick(new GetVariable(NoteGreenVar)));
        }
        return block;
    }
});

levels.push(new class implements Level {

    name = "Basic If";

    getCode(): Block {
        let block = new Block()
            .addCommand(new SetVariable(BoolGreenVar, new BooleanLiteral(true)))
            .addCommand(new Strum(new Literal(1)))
            .addCommand(new If(new GetVariable(BoolGreenVar),
                new Block().addCommand(new Strum(new Literal(4))))
            ).addCommand(new Strum(new Literal(1)))
        return block;
    }
});

levels.push(new class implements Level {

    name = "Basic If/Else";

    getCode(): Block {
        let block = new Block()
            .addCommand(new SetVariable(BoolGreenVar, new BooleanLiteral(true)))
            .addCommand(new Strum(new Literal(1)))
            .addCommand(new If(new GetVariable(BoolGreenVar),
                new Block().addCommand(new Strum(new Literal(4))),
                new Block().addCommand(new Strum(new Literal(5)))
            )).addCommand(new Strum(new Literal(1)))
        return block;
    }
});

levels.push(new class implements Level {

    name = "If in Repeat";

    getCode(): Block {
        let block = new Block()
            .addCommand(new SetVariable(BoolGreenVar, new BooleanLiteral(true)))
            .addCommand(new Repeat(new NumberLiteral(2), new Block()
                .addCommand(new Strum(new Literal(1)))
                .addCommand(new If(new GetVariable(BoolGreenVar),
                    new Block().addCommand(new Strum(new Literal(4))),
                    new Block().addCommand(new Strum(new Literal(5)))
                )).addCommand(new Strum(new Literal(1)))
                .addCommand(new ChangeVariable(BoolGreenVar, new NumberLiteral(1)))
            ));

        return block;
    }
});


export function test() {
    levels.forEach(level => {
        console.log('Level', level.name);
        let code = level.getCode();
        console.log('Code', code);
        let rendered = code.render();
        console.log('Rendered', rendered);
        console.log('Rendered String');
        console.log(rendered.toString());
        let trace = new ExecutionTrace();
        code.addToTrace(trace);
        console.log('Trace', trace);
    })
}