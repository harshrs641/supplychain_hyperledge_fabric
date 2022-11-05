import { Object as FabricObject, Property } from 'fabric-contract-api';

@FabricObject()
export class InCharge {
    constructor(obj?: Partial<InCharge>) {
        Object.assign(this, obj);
    }

    @Property()
    name: string;

    @Property()
    type: string;

    @Property()
    contact: string;

}