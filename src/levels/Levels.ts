import { Block } from "../code/Block";
import { ChangeListItem } from "../code/ChangeListItem";
import { ChangeVariable } from "../code/ChangeVariable";
import { ExecutionTrace } from "../code/ExecutionTrace";
import { ForEachLoop } from "../code/ForEachLoop";
import { FunctionCall } from "../code/FunctionCall";
import { FunctionDefinition } from "../code/FunctionDefinition";
import { GetListItem } from "../code/GetListItem";
import { GetVariable } from "../code/GetVariable";
import { If } from "../code/If";
import { ListExpression } from "../code/ListExpression";
import { BooleanLiteral, Literal, LiteralType, NumberLiteral } from "../code/Literal";
import { Pick } from "../code/Pick";
import { Program } from "../code/Program";
import { Repeat } from "../code/Repeat";
import { SetListItem } from "../code/SetListItem";
import { SetVariable } from "../code/SetVariable";
import { Strum } from "../code/Strum";
import { Bool1Var, Note2Var, Note1Var, Variable, List1Var } from "../code/Variable";

export abstract class Level {

    name: string;
    category: string;
    abstract getMain(): Block;
    addFunctions(program: Program) { }
    getCode(): Program {
        let p = new Program(this.getMain(), []);
        this.addFunctions(p);
        return p;
    }
}

export const levels = [] as Level[];



levels.push(new class extends Level {
    name = "Strum Basics";
    category = "Basics";

    getMain(): Block {
        return new Block()
            .addCommand(new Strum(1))
            .addCommand(new Strum(4))
            .addCommand(new Strum(5))
            .addCommand(new Strum(1))
        ;
    }
})

levels.push(new class extends Level {

    name = "Basic Repeat";
    category = "Repeat";

    getMain(): Block {
        return new Block()
            .addCommand(new Repeat(new NumberLiteral(4),
                new Block()
                .addCommand(new Strum(new Literal(1)))
                .addCommand(new Strum(new Literal(4)))
                .addCommand(new Strum(new Literal(5)))
                .addCommand(new Strum(new Literal(1)))
            )
        );
    }
});

levels.push(new class extends Level {

    name = "Nested Repeat";
    category = "Repeat";

    getMain(): Block {
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

levels.push(new class extends Level {

    name = "Half Scale 1";
    category = "Variable Basics";

    getMain(): Block {
        let block = new Block();
        for (let note = 1; note <= 4; note++) {
            block.addCommand(new SetVariable(Note1Var, new Literal(note)));
            block.addCommand(new Pick(new GetVariable(Note1Var)));
        }
        return block;
    }
});

levels.push(new class extends Level {

    name = "Half Scale 2";
    category = "Variable Basics";

    getMain(): Block {
        let block = new Block();
        block.addCommand(new SetVariable(Note1Var, new Literal(1)));
        block.addCommand(new Pick(new GetVariable(Note1Var)));
        for (let note = 2; note <= 4; note++) {
            block.addCommand(new ChangeVariable(Note1Var, new Literal(1)));
            block.addCommand(new Pick(new GetVariable(Note1Var)));
        }
        return block;
    }
});

levels.push(new class extends Level {

    name = "Arpeggio 2";
    category = "Variable Basics";

    getMain(): Block {
        return new Block()
            .addCommand(new SetVariable(Note1Var, new Literal(1)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(2)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(2)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(3)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
        ;
    }
});

levels.push(new class extends Level {

    name = "Half Scale Down";
    category = "Variable Basics";

    getMain(): Block {
        let block = new Block();
        block.addCommand(new SetVariable(Note1Var, new Literal(4)));
        block.addCommand(new Pick(new GetVariable(Note1Var)));
        for (let note = 2; note <= 4; note++) {
            block.addCommand(new ChangeVariable(Note1Var, new Literal(-1)));
            block.addCommand(new Pick(new GetVariable(Note1Var)));
        }
        return block;
    }
});

levels.push(new class extends Level {

    name = "Basic If";
    category = "Conditional Basics";

    getMain(): Block {
        let block = new Block()
            .addCommand(new SetVariable(Bool1Var, new BooleanLiteral(true)))
            .addCommand(new Strum(new Literal(1)))
            .addCommand(new If(new GetVariable(Bool1Var),
                new Block().addCommand(new Strum(new Literal(4))))
            ).addCommand(new Strum(new Literal(1)))
        return block;
    }
});

levels.push(new class extends Level {

    name = "Basic If/Else";
    category = "Conditional Basics";

    getMain(): Block {
        let block = new Block()
            .addCommand(new SetVariable(Bool1Var, new BooleanLiteral(false)))
            .addCommand(new Strum(new Literal(1)))
            .addCommand(new If(new GetVariable(Bool1Var),
                new Block().addCommand(new Strum(new Literal(4))),
                new Block().addCommand(new Strum(new Literal(5)))
            )).addCommand(new Strum(new Literal(1)))
        return block;
    }
});

levels.push(new class extends Level {

    name = "If in Repeat";
    category = "Conditional Basics";

    getMain(): Block {
        let block = new Block()
            .addCommand(new SetVariable(Bool1Var, new BooleanLiteral(true)))
            .addCommand(new Repeat(new NumberLiteral(2), new Block()
                .addCommand(new Strum(new Literal(1)))
                .addCommand(new If(new GetVariable(Bool1Var),
                    new Block().addCommand(new Strum(new Literal(5))),
                    new Block().addCommand(new Strum(new Literal(4))),
                )).addCommand(new Strum(new Literal(1)))
                .addCommand(new Strum(new Literal(1)))
                .addCommand(new ChangeVariable(Bool1Var, new NumberLiteral(1)))
            ));

        return block;
    }
});

levels.push(new class extends Level {
    name = "Function Test";
    category = "Functions";

    getMain(): Block {
        return new Block()
            .addCommand(new FunctionCall('test', new Literal(1)))
            .addCommand(new FunctionCall('test', new Literal(4)))
            .addCommand(new FunctionCall('test', new Literal(5)))
            .addCommand(new FunctionCall('test', new Literal(1)))
        ;
    }

    addFunctions(program: Program): void {
        let def = new FunctionDefinition('test', [
            Note1Var,
        ], new Block()
            .addCommand(new Strum(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(1)))
            .addCommand(new Strum(new GetVariable(Note1Var)))
        )
        program.functions.push(def);
    }
})

levels.push(new class extends Level {

    name = "Many Arpeggio";
    category = "Functions";
    arp = 'Arpeggio'

    override getMain(): Block {
        return new Block()
            .addCommand(new FunctionCall(this.arp, new Literal(1)))
            .addCommand(new FunctionCall(this.arp, new Literal(2)))
            .addCommand(new FunctionCall(this.arp, new Literal(3)))
            .addCommand(new FunctionCall(this.arp, new Literal(4)))
    }

    override addFunctions(program: Program) {
        program.functions.push(new FunctionDefinition(this.arp, [Note1Var], new Block()
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(2)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(2)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(3)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
        ))
    }
});


levels.push(new class extends Level {
    name = "Swallowtail Jig";
    category = "Tunes";

    BaDaDa = (() => {
        return new FunctionDefinition('BaDaDa', [Note1Var, Note2Var], new Block()
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new Pick(new GetVariable(Note2Var)))
            .addCommand(new Pick(new GetVariable(Note2Var)))
        );
    })();

    Down3 = (() => {
        return new FunctionDefinition('Down3', [Note1Var], new Block()
            .addCommand(new Repeat(new Literal(3, LiteralType.Number), new Block()
                .addCommand(new Pick(new GetVariable(Note1Var)))
                .addCommand(new ChangeVariable(Note1Var, new Literal(-1, LiteralType.RotationChange)))
            ))
        );
    })();

    DaBaDa = (() => {
        return new FunctionDefinition('DaBaDa', [Note1Var], new Block()
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(-1, LiteralType.RotationChange)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
            .addCommand(new ChangeVariable(Note1Var, new Literal(1, LiteralType.RotationChange)))
            .addCommand(new Pick(new GetVariable(Note1Var)))
        );
    })();

    override getMain(): Block {
        return new Block()
            .addCommand(new SetVariable(Bool1Var, new Literal(false, LiteralType.Boolean)))
            .addCommand(new Repeat(new Literal(2, LiteralType.Number), new Block()
                .addCommand(new FunctionCall(this.BaDaDa.name, new Literal(4), new Literal(2)))
                .addCommand(new FunctionCall(this.BaDaDa.name, new Literal(6), new Literal(2)))
                .addCommand(new FunctionCall(this.BaDaDa.name, new Literal(4), new Literal(2)))
                .addCommand(new If(new GetVariable(Bool1Var), new Block()
                    .addCommand(new Pick(new Literal(6), 2))
                    .addCommand(new Pick(new Literal(7)))
                , new Block()
                    .addCommand(new FunctionCall(this.Down3.name, new Literal(6)))
                    .addCommand(new FunctionCall(this.BaDaDa.name, new Literal(3), new Literal(1)))
                    .addCommand(new FunctionCall(this.BaDaDa.name, new Literal(5), new Literal(1)))
                ))
                .addCommand(new FunctionCall(this.DaBaDa.name, new Literal(8)))
                .addCommand(new FunctionCall(this.Down3.name, new Literal(5)))
                .addCommand(new If(new GetVariable(Bool1Var), new Block()
                    .addCommand(new FunctionCall(this.BaDaDa.name, new Literal(4), new Literal(2)))
                    .addCommand(new Pick(new Literal(2), 3))
                ))
                .addCommand(new SetVariable(Bool1Var, new Literal(true, LiteralType.Boolean)))
            ))
    }

    override addFunctions(program: Program) {
        program.functions.push(this.BaDaDa, this.Down3, this.DaBaDa);
    }
})


levels.push(new class extends Level {
    name = "Read List";
    category = "List Basics";

    getMain(): Block {
        return new Block()
            .addCommand(new SetVariable(List1Var, new ListExpression([1, 2, 3])))
            .addCommand(new Strum(new GetListItem(List1Var, 1)))
            .addCommand(new Strum(new GetListItem(List1Var, 2)))
            .addCommand(new Strum(new GetListItem(List1Var, 3)))
        ;
    }
});

levels.push(new class extends Level {
    name = "Write to List (I)";
    category = "List Basics";

    getMain(): Block {
        return new Block()
            .addCommand(new SetVariable(List1Var, new ListExpression([1, 2, 1])))
            .addCommand(new Pick(new GetListItem(List1Var, 1)))
            .addCommand(new Pick(new GetListItem(List1Var, 2)))
            .addCommand(new Pick(new GetListItem(List1Var, 3)))
            .addCommand(new SetListItem(List1Var, 2, 3))
            .addCommand(new Pick(new GetListItem(List1Var, 1)))
            .addCommand(new Pick(new GetListItem(List1Var, 2)))
            .addCommand(new Pick(new GetListItem(List1Var, 3)))
            .addCommand(new SetListItem(List1Var, 2, 4))
            .addCommand(new Pick(new GetListItem(List1Var, 1)))
            .addCommand(new Pick(new GetListItem(List1Var, 2)))
            .addCommand(new Pick(new GetListItem(List1Var, 3)))
        ;
    }
});


levels.push(new class extends Level {
    name = "Write to List (II)";
    category = "List Basics";

    getMain(): Block {
        return new Block()
            .addCommand(new SetVariable(List1Var, new ListExpression([3, 2, 1])))
            .addCommand(new Pick(new GetListItem(List1Var, 1)))
            .addCommand(new Pick(new GetListItem(List1Var, 2)))
            .addCommand(new Pick(new GetListItem(List1Var, 3)))
            .addCommand(new SetListItem(List1Var, 1, 4))
            .addCommand(new SetListItem(List1Var, 2, 5))
            .addCommand(new SetListItem(List1Var, 3, 6))
            .addCommand(new Pick(new GetListItem(List1Var, 1)))
            .addCommand(new Pick(new GetListItem(List1Var, 2)))
            .addCommand(new Pick(new GetListItem(List1Var, 3)))
        ;
    }
});

levels.push(new class extends Level {
    name = "List Loop";
    category = "List Loops";

    getMain(): Block {
        return new Block()
            .addCommand(new ForEachLoop(new ListExpression([3, 2, 1]), Note1Var, new Block()
                .addCommand(new Pick(Note1Var))
            ))
        ;
    }
});


levels.push(new class extends Level {
    name = "Changing List in a Loop";
    category = "List Loops";

    getMain(): Block {
        return new Block()
            .addCommand(new SetVariable(List1Var, new ListExpression([1, 3, 5])))
            .addCommand(new Repeat(3, new Block()
                .addCommand(new ForEachLoop(List1Var, Note1Var, new Block()
                    .addCommand(new Pick(Note1Var))
                ))
                .addCommand(new ChangeListItem(List1Var, 1, 1))
                .addCommand(new ChangeListItem(List1Var, 2, 1))
                .addCommand(new ChangeListItem(List1Var, 3, 1))
            ))

        ;
    }
});

export const levelCategories = levels.map(l => l.category).filter((v, i, a) => a.indexOf(v) === i);
export const levelMap = new Map(levelCategories.map(cat => [cat, levels.filter(l => l.category == cat)]));