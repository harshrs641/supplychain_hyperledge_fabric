import { Object as FabricObject, Property } from 'fabric-contract-api';
import { Metadata } from '../metadata';

@FabricObject()
export class ShippingEntry {


    @Property()
    from: string;

    @Property()
    to: string;

    @Property('managedBy', 'Metadata')
    managedBy: Metadata;

    @Property()
    arrivalDate: number;

    @Property()
    status: string;
}