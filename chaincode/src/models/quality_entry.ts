import { Object as FabricObject, Property } from 'fabric-contract-api';


@FabricObject()
export class QualityEntry {
    @Property()
    weight: number;

    @Property()
    purity: number;

    @Property()
    form: string;

    @Property()
    type: string;

    @Property()
    unitQuantity: number;
}