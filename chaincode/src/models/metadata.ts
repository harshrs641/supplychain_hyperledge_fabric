import { Object as FabricObject, Property } from 'fabric-contract-api';

@FabricObject()
export class Metadata {
    constructor(obj?: Partial<Metadata>) {
        Object.assign(this, obj);
    }

    @Property()
    mongoDBId: string;

    @Property()
    type: string;

    @Property()
    assignedDate: number;

}