import EventInterface from "../../@shared/event/event.interface";
import { CustomerAddressChangedData } from "./customer-address-changed-data.interface";

export class CustomerAddressChanged implements EventInterface {
    readonly dataTimeOccurred: Date
    readonly eventData: CustomerAddressChangedData;

    constructor(
        eventData: CustomerAddressChangedData
    ) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData
    }
}