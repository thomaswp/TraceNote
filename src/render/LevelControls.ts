import { LitElement, html, css, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Block } from '../code/Block';
import { ExecutionData, ExecutionTrace, PlayChordData, PlayNoteData, RunData } from '../code/ExecutionTrace';
import { Level } from '../levels/Levels';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import { AudioLoader } from '../audio/AudioLoader';
import { MusicPlayer } from '../audio/MusicPlayer';
import { Input, StrumArgs } from '../input/Input';

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

    private _level: Level;
    private code: Block;
    private codeHTML = '';
    private name = '';
    private trace: ExecutionTrace;

    private playbackQueue: ExecutionData[] = [];
    private player: MusicPlayer;
    private playing = false;

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
    <div class="code-container">
        <h2>${this.name}</h2>
        <div class="code-content">${unsafeHTML(this.codeHTML)}</div>
        <button class="btn btn-primary" @click="${(this.start)}">Start</button>
        <button class="btn btn-primary" @click="${() => this.play(this.trace.data)}">Play</button>
    </div>
    `
    }

    private start() {
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
            Input.strum.remove(callback);
            Input.pick.remove(callback);
            setTimeout(() => {
                this.player.playSuccess();
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
                if (data.dir == next.note) {
                    this.play(blockingList[0][1]);
                    blockingList.splice(0, 1);
                    checkFinished();
                } else {
                    AudioLoader.loadAll().then(() => {
                        let player = new MusicPlayer("B3");
                        player.playSqueal();
                    });
                }
            }
        }
        Input.strum.add(callback);
        Input.pick.add(callback);
        checkFinished();
    }

    private play(data: ExecutionData[]) {
        this.playbackQueue.push(...data);
        if (this.player) {
            this.tryStartPlayback();
            return;
        }
        AudioLoader.loadAll().then(() => {
            this.player = new MusicPlayer("C3");
            this.tryStartPlayback();
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
                player.playNote(event.note, 1);
                clearHighlights();
            }
            if (event instanceof RunData) {
                // console.log(event.node, event.node.id);
                addHighlight(event.node.id);
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