import {
    inject
} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class App {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.message = 'Sling|Puck by ashWare';
    }

}
