import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import { MatterService } from '../services/matter-service';
// import { Puck } from './puck';

@inject(EventAggregator, MatterService)
export class GameScreenCustomElement {

    constructor(eventAggregator, matterService) {
        this.ea = eventAggregator;
        this._matterService = matterService;
    }

    attached() {
        this._$arena = $('.arena');
        this._matterService.setWorld(this._$arena);
        this._$arena[0].addEventListener("touchstart", this.touchHandler, false);

        this._puckSize = $('body').width() / 20;
        this.viewportHeight = window.height - 60;

        this._center = {
            x: this._$arena.width() / 2,
            y: this._$arena.height() / 2
        };
        const arena = this._getArena();

        this._setWalls();
        this._setPucks();
        this._matterService.useMouse();
        this._matterService.startEngine();
        this._startGame();
    }

    detached() {
        this._resizeObserver.disconnect();
        $('canvas').off('click.start');
    }

    touchHandler(event) {
        if (event.touches.length > 1) {
            //the event is multi-touch
            //you can then prevent the behavior
            event.preventDefault();
        }
    }

    _startGame() {
        $('canvas').on('click.start', (event) => {
            this._matterService.moveBalls(event.clientX, event.clientY);
        });
    }

    _getArena() {
        return {
            width: this._$arena.width(),
            height: this._$arena.height(),
            center: this._center,
            wallSize: 40
        };
    }

    _clearArena() {
        this._matterService.clearArena();
    }

    _setPucks() {
        this._pucks = [];
        const arena = this._getArena();
        const player = [arena.width / 2, arena.height / 4 * 3, this._puckSize];
        const opponent = [arena.width / 2, arena.height / 4, this._puckSize];
        this._pucks.push(player, opponent);
        this._matterService.setPucks(this._pucks);
    }

    _setWalls() {
        const arena = this._getArena();
        const goalOversize = 10;
        const barWidth = this._center.x - this._puckSize - goalOversize;
        const goalBars = [
            {
                x: barWidth / 2,
                y: this._center.y,
                width: barWidth,
                height: arena.wallSize
            }, {
                x: arena.width - barWidth / 2,
                y: this._center.y,
                width: barWidth,
                height: arena.wallSize
            }
        ];
        this._walls = [
            [this._center.x, -arena.wallSize,
            arena.width, arena.wallSize],
            [arena.width + arena.wallSize / 2, arena.height / 2,
            arena.wallSize, arena.height],
            [this._center.x, arena.height + arena.wallSize / 2,
            arena.width, arena.wallSize],
            [-arena.wallSize / 2, arena.height / 2,
            arena.wallSize, arena.height],
            [goalBars[0].x, goalBars[0].y,
            goalBars[0].width, goalBars[0].height],
            [goalBars[1].x, goalBars[1].y,
            goalBars[1].width, goalBars[1].height],
        ];
        this._matterService.setWalls(this._walls);
    }

}
