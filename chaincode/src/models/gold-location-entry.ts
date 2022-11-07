import { Object as FabricObject, Property } from 'fabric-contract-api';

@FabricObject()
export class LocationEntry {
    constructor(obj?: Partial<LocationEntry>) {
        Object.assign(this, obj);
    }

    @Property()
    location: string;

    @Property()
    arrivalDate: number;
}