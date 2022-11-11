import { Object as FabricObject, Property } from 'fabric-contract-api';
import { Metadata } from '../metadata';

@FabricObject()
export class InChargeEntry {
    constructor(obj?: Partial<InChargeEntry>) {
        Object.assign(this, obj);
    }


    @Property('self', 'Metadata')
    self: Metadata;

    @Property('captain', 'Metadata')
    captain: Metadata;

    @Property()
    weight: number;

    @Property()
    purity: number;

    @Property()
    weightScaleImage: string;

    @Property()
    purityScaleImage: string;

}