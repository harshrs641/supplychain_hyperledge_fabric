import { Object as FabricObject, Property } from 'fabric-contract-api';

@FabricObject()
export class InCharge {
    constructor(obj?: Partial<InCharge>) {
        Object.assign(this, obj);
    }

    @Property()
    mongoDBId: string;

//// MANAGER | CAPTAIN | CUSTODIAN | REFINER | VERIFIER
    @Property()
    type: string;

    @Property()
    assignedDate: number;

    @Property()
    weight: number;

    @Property()
    purity: number;

    @Property()
    weightScaleImage: string;

    @Property()
    purityScaleImage: string;

}