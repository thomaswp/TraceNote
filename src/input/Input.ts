import Joymap, { QueryModule, EventModule } from 'joymap';


export class Event<T> {
    private callbacks: ((data: T) => void)[] = [];

    add(callback: (data: T) => void) {
        this.callbacks.push(callback);
    }

    remove(callback: (data: T) => void) {
        let index = this.callbacks.indexOf(callback);
        if (index >= 0) this.callbacks.splice(index, 1);
    }

    trigger(data: T) {
        this.callbacks.forEach(c => c(data));
    }
}

export interface StrumArgs {
    dir: number;
}

export interface LeftStickArgs {
    x: number;
    y: number;
    dir: number;
}

function stickToNumber(value: number[]) {
    const [x, y] = value;
    let angle = Math.atan2(y, x);
    console.log(angle);
    let angleEigth = (angle + Math.PI * 2) / Math.PI * 4;
    return Math.round(angleEigth) % 8 + 1;
}

export class Input {

    static strum = new Event<StrumArgs>();
    static pick = new Event<StrumArgs>();
    static leftStickMove = new Event<LeftStickArgs>();

    private static module: QueryModule;

    static init() {
        const joymap = Joymap.createJoymap({
            onPoll: () => this.update(),
            autoConnect: true
        });

        this.module = Joymap.createQueryModule({ threshold: 0.2, clampThreshold: true });
        joymap.addModule(this.module);
        joymap.start();
    }

    private static update() {
        const a = this.module.getButton('A');
        const x = this.module.getButton('X');
        const leftStick = this.module.getStick('L');
        if (leftStick.justChanged) {
            const [x, y] = leftStick.value;
            const dir = Math.atan2(y, x);
            this.leftStickMove.trigger({
                x, y, dir,
            });
        }
        if (a.pressed && a.justChanged) {
            const dir = stickToNumber(leftStick.value);
            // console.log(leftStick.value, dir);
            this.strum.trigger({dir: dir});
        }
        if (x.pressed && x.justChanged) {
            const dir = stickToNumber(leftStick.value);
            // console.log(leftStick.value, dir);
            this.pick.trigger({dir: dir});
        }
    }
}

Input.init();