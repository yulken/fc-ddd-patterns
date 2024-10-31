import { Sequelize } from "sequelize-typescript";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log-1-handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log-2-handler";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log-handler";
import { CustomerService } from "./customer.service";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../entity/customer";
import Address from "../value-object/address";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should send event on customer creation", async () => {
        const customerRepository = new CustomerRepository();
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyHandler2 = jest.spyOn(eventHandler2, "handle");
        
        eventDispatcher.register("CustomerCreatedEvent", eventHandler1)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
        eventDispatcher.register("CustomerAddressChanged", new EnviaConsoleLogHandler())
        const customerService = new CustomerService(customerRepository, eventDispatcher);

        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");

        await customerService.create("joao", address);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"])
            .toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length)
            .toBe(2)
        expect(spyHandler1).toHaveBeenCalled();
        expect(spyHandler2).toHaveBeenCalled();

    });


    it("should send event when customer's address is updated", async () => {
        const customerRepository = new CustomerRepository();
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler();
        const spyHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddressChanged", eventHandler)
        const customerService = new CustomerService(customerRepository, eventDispatcher);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer);

        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");

        await customerService.updateAddress(customer, address2);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"])
            .toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"].length)
            .toBe(1)
        expect(spyHandler).toHaveBeenCalled();
    });
});
