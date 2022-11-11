import { Object as FabricObject, Property } from 'fabric-contract-api';
import { Metadata } from '../metadata';

@FabricObject()
export class ProcessEntry {
    @Property('managedByID','Metadata')
    managedByID: Metadata;

    @Property()
    arrivalDate: number;

    @Property()
    status: string;

    @Property()
    type: string;
}