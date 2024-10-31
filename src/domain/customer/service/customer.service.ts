import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import { v4 as uuidv4 } from 'uuid';
import Address from "../value-object/address";
import { CustomerCreatedEvent } from "../event/customer-created.event";
import { CustomerAddressChanged } from "../event/customer-address-changed.event";
import CustomerRepositoryInterface from "../repository/customer-repository.interface";

export class CustomerService {
    constructor(
        private customerRepo: CustomerRepositoryInterface,
        private eventDispatcher: EventDispatcher

    ) {
    }
    async create(name: string, address: Address) {
        const customer = Customer.create(uuidv4(), name);
        customer.changeAddress(address)
        await this.customerRepo.create(customer);
        this.eventDispatcher.notify(new CustomerCreatedEvent(customer.id))
        return customer;
    }

    async updateAddress(customer: Customer, address: Address) {
        customer.changeAddress(address)
        await this.customerRepo.update(customer);
        this.eventDispatcher.notify(new CustomerAddressChanged({
            id: customer.id, 
            address,
            name: customer.name
        }))
        return customer;
    }
}