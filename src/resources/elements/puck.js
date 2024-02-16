import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class PuckCustomElement {

    constructor(eventAggregator) {
        this._ea = eventAggregator;
    }

    attached() {
    }
}
