import Joymap, { QueryModule, EventModule } from 'joymap';

export type EventCallback<T> = (data: T) => void;


export class InputEvent<T> {
    private callbacks: EventCallback<T>[] = [];
    private bindingMap = new Map<any, EventCallback<T>[]>();

    private static allEvents: InputEvent<any>[] = [];

    constructor() {
        InputEvent.allEvents.push(this);
    }

    add(callback: (data: T) => void, binding?: any) {
        this.callbacks.push(callback);
        if (binding) {
            if (!this.bindingMap.has(binding)) this.bindingMap.set(binding, []);
            this.bindingMap.get(binding).push(callback);
        }
    }

    remove(callback: EventCallback<T>): boolean {
        let index = this.callbacks.indexOf(callback);
        if (index < 0) return false;
        this.callbacks.splice(index, 1);
        return true;
    }

    removeAll(binding: any): boolean {
        if (!this.bindingMap.has(binding)) return false;
        this.bindingMap.get(binding).forEach(c => this.remove(c));
        return true;
    }

    static removeFromAllEvents(binding: any) {
        InputEvent.allEvents.forEach(e => e.removeAll(binding));
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
    if (x == 0 && y == 0) return 0;
    let angle = Math.atan2(y, x);
    let angleEigth = (angle + Math.PI * 2) / Math.PI * 4;
    return Math.round(angleEigth) % 8 + 1
}

export class Input {

    static strum = new InputEvent<StrumArgs>();
    static pick = new InputEvent<StrumArgs>();
    static leftStickMove = new InputEvent<LeftStickArgs>();

    private static module: QueryModule;

    private static lastLeftStickValue = [0, 0];

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
        const aButton = this.module.getButton('A');
        const xButton = this.module.getButton('X');
        const leftStick = this.module.getStick('L');

        const [x, y] = leftStick.value;
        if (x != this.lastLeftStickValue[0] || y != this.lastLeftStickValue[1]) {
            this.lastLeftStickValue = [x, y];
            const dir =  stickToNumber(leftStick.value);
            this.leftStickMove.trigger({
                x, y, dir,
            });
        }


        if (aButton.pressed && aButton.justChanged) {
            const dir = stickToNumber(leftStick.value);
            // console.log(leftStick.value, dir);
            this.strum.trigger({dir: dir});
        }
        if (xButton.pressed && xButton.justChanged) {
            const dir = stickToNumber(leftStick.value);
            // console.log(leftStick.value, dir);
            this.pick.trigger({dir: dir});
        }
    }
}

Input.init();