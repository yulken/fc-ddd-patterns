import EventInterface from "../../@shared/event/event.interface";

export class CustomerAddressChanged implements EventInterface{
    readonly dataTimeOccurred: Date
    readonly eventData: any;

    constructor(
        eventData: any
    ){
        this.dataTimeOccurred = new Date();
        this.eventData = eventData
    }
}