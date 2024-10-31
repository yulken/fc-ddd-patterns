import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import Address from "../../value-object/address";
import { CustomerAddressChanged } from "../customer-address-changed.event";


export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerAddressChanged>
{
  handle(event: CustomerAddressChanged): void {
    const id: string = event.eventData.id
    const name: string = event.eventData.name
    const address: Address = event.eventData.address
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`); 
  }
}