import {
    inject,
    bindable
} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';

@inject(BindingSignaler, EventAggregator)

export class DragService {

    constructor(bindingSignaler, eventAggregator) {
        this.bnds = bindingSignaler;
        this._ea = eventAggregator;
        this._isDragged = false;
    }

    getPointerPosition(event) {
        const clientPos = {
            x: (event.touches) ? event.touches[0].clientX : event.clientX,
            y: (event.touches) ? event.touches[0].clientY : event.clientY
        };
        return clientPos;
    }

    _setDistance(x, y) {
        this._distance = {
            x: x,
            y: y
        };
    }

    getDistance() {
        return this._distance;
    }

    _setDragStartPos(x, y) {
        this._dragStartPos = {
            x: x,
            y: y
        };
    }

    getDragStartPos() {
        return this._dragStartPos;
    }

    _setElementStartPos(x, y) {
        this._elementStartPos = {
            x: x,
            y: y
        };
    }

    getElementStartPos() {
        return this._elementStartPos;
    }

    _setElementEndPos(x, y) {
        this._elementFinalPos = {
            x: x,
            y: y
        };
    }

    getElementFinalPos() {
        return this._elementFinalPos;
    }

    getIsDragged() {
        return this._isDragged;
    }

    startDrag(event) {
        if (!this._isDragged) {
            this._isDragged = true;
            const pointerPosition = this.getPointerPosition(event);
            this._setDragStartPos(pointerPosition.x, pointerPosition.y);
            this._setElementStartPos(event.target.offsetLeft, event.target.offsetTop);
            this._distance = undefined;
            this._elementFinalPos = undefined;
        }
    }

    doDrag(event) {
        if (this._isDragged) {
            const pointerPosition = this.getPointerPosition(event);
            this._setDistance(pointerPosition.x - this._dragStartPos.x, pointerPosition.y - this._dragStartPos.y);
        }
    }

    stopDrag() {
        if (this._isDragged) {
            const finalX = this._elementStartPos.x + this._distance.x;
            const finalY = this._elementStartPos.y + this._distance.y;
            this._setElementEndPos(finalX, finalY);
            this._setElementStartPos(finalX, finalY);
            this._isDragged = false;
        }
    }
}
