import Address from "../value-object/address";

export interface CustomerAddressChangedData {
    id: string,
    name: string,
    address: Address
}