import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Block } from '../code/Block';
import { ExecutionData, ExecutionTrace, PlayChordData, PlayNoteData, RunData, UpdateVarData } from '../code/ExecutionTrace';
import { Level, levelCategories, levelMap, levels } from '../levels/Levels';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import { AudioLoader } from '../audio/AudioLoader';
import { MusicPlayer } from '../audio/MusicPlayer';
import { Input, InputEvent, InputNames, StrumArgs } from '../input/Input';
import { Program } from '../code/Program';
import { VariableDisplay } from './VariableDisplay';

@customElement('level-controls')
export class LevelControls extends LitElement {

    @property() set level(level: Level) {
        if (level == this.level) return;
        this.code = level.getCode();
        this.name = level.name;
        this.codeHTML = this.code.render().toString('', true);
        this.trace = new ExecutionTrace();
        this.code.addToTrace(this.trace);

        let oldValue = this._level;
        this._level = level;
        this.requestUpdate('level', oldValue);
    };
    get level() { return this._level; }

    private _level: Level;
    private code: Program;
    private codeHTML = '';
    private name = '';
    private trace: ExecutionTrace;

    private playbackQueue: ExecutionData[] = [];
    private player: MusicPlayer;
    private playing = false;

    private varDisplay: VariableDisplay;

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
    <div class="code-container">
        <h2>${this.level.category}: ${this.name}</h2>
        <button class="btn btn-primary" @click="${(this.start)}">Start</button>
        <button class="btn btn-primary" @click="${() => this.playAll()}">Play</button>
        <div class="level-layout">
            <div class="code-content">${unsafeHTML(this.codeHTML)}</div>
            <div class="info-panel-right">
                <variable-display id="var-display" .variables=${[...this.trace.variables]}></variable-display>
            </div>
        </div>
    </div>
    `
    }

    private reset() {
        this.stop();
        this.varDisplay = this.renderRoot.querySelector('variable-display') as VariableDisplay;
        this.varDisplay.init();
    }

    private start() {
        console.log("!!");
        this.reset();
        let blockingList = [] as ([ExecutionData, ExecutionData[]])[];
        let currentList = [] as ExecutionData[];

        this.trace.data.forEach(event => {
            currentList.push(event);
            if (event.isBlocking()) {
                blockingList.push([event, currentList]);
                currentList = [];
            }
        });

        if (currentList.length > 0) {
            blockingList.push([null, currentList]);
            currentList = [];
        }

        const finish = () => {
            Input.strum.removeAll(this);
            Input.pick.removeAll(this);
            setTimeout(() => {
                this.player.playSuccess();
                this.reset();
            }, 500);
        }

        let callback;
        const checkFinished = () => {
            if (blockingList.length == 0) {
                finish();
                return;
            }
            if (blockingList.length == 1 && blockingList[0][0] == null) {
                this.play(blockingList[0][1]);
                finish();
                return;
            }
        }

        callback = (data: StrumArgs) => {
            let next = blockingList[0][0];
            if (next instanceof PlayChordData || next instanceof PlayNoteData) {
                if ((data.dir - 1) % 8 == (next.note - 1) % 8) {
                    this.play(blockingList[0][1]);
                    blockingList.splice(0, 1);
                    checkFinished();
                } else {
                    AudioLoader.loadAll().then(() => {
                        let player = new MusicPlayer("C3");
                        player.playSqueal(data.dir);
                    });
                }
            }
        }
        Input.strum.add(callback, this);
        Input.pick.add(callback, this);
        checkFinished();
    }

    override connectedCallback(): void {
        super.connectedCallback();
        Input.pressed(InputNames.Start).add(() => this.start(), this);
        Input.pressed(InputNames.DPadLeft).add(() => this.changeLevel(-1), this);
        Input.pressed(InputNames.DPadRight).add(() => this.changeLevel(1), this);
        Input.pressed(InputNames.DPadUp).add(() => this.changeCategory(-1), this);
        Input.pressed(InputNames.DPadDown).add(() => this.changeCategory(1), this);
    }

    override disconnectedCallback(): void {
        this.stop();
        InputEvent.removeFromAllEvents(this);
        super.disconnectedCallback();
    }

    private changeLevel(by: number) {
        if (!this.level) return;
        let index = levels.indexOf(this.level);
        if (index < 0) return;
        index += by;
        if (index < 0 || index >= levels.length) return;
        this.level = levels[index];
    }

    private changeCategory(by: number) {
        if (!this.level) return;
        let index = levelCategories.indexOf(this.level.category);
        if (index < 0) return;
        index += by;
        if (index < 0 || index >= levelCategories.length) return;
        let category = levelCategories[index];
        this.level = levelMap.get(category)[0];
    }

    private playAll() {
        this.reset();
        this.play(this.trace.data, true);
    }

    private stop() {
        Input.strum.removeAll(this);
        Input.pick.removeAll(this);
        this.playbackQueue = [];
        if (this.player) {
            this.player.stop();
        }
    }

    private play(data: ExecutionData[], reset = false) {
        this.playbackQueue.push(...data);
        if (this.player) {
            this.tryStartPlayback();
            if (reset) {
                this.player.whenReady(() => this.reset());
            }
            return;
        }
        AudioLoader.loadAll().then(() => {
            this.player = new MusicPlayer("C3");
            this.tryStartPlayback();
            if (reset) {
                this.player.whenReady(() => this.reset());
            }
        })
    }

    private tryStartPlayback() {
        if (this.playing) return;
        if (this.playbackQueue.length == 0) return;

        this.playing = true;
        let data = this.playbackQueue;
        this.playbackQueue = [];
        let player = this.player;

        let highlighted = [] as HTMLElement[];
        function clearHighlights() {
            player.whenReady(() => {
                highlighted.forEach(h => h.classList.remove('running'));
                highlighted = [];
            });
        }
        function addHighlight(id) {
            let node = document.getElementById(id);
            player.whenReady(() => {
                node.classList.add('running');
                highlighted.push(node);
            });
        }

        data.forEach(event => {
            if (event instanceof PlayChordData) {
                player.playChord(event.note, 4);
                clearHighlights();
            }
            if (event instanceof PlayNoteData) {
                player.playNote(event.note, event.duration);
                clearHighlights();
            }
            if (event instanceof RunData) {
                // console.log(event.node, event.node.id);
                addHighlight(event.node.id);
            }
            if (event instanceof UpdateVarData) {
                player.whenReady(() => {
                    this.varDisplay.updateVariable(event);
                });
            }
        });

        player.whenReady(() => {
            clearHighlights();
            this.playing = false;
            this.tryStartPlayback();
        });
    }

    // private dispatch
}