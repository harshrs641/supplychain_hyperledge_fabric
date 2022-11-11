import { Object as FabricObject, Property } from 'fabric-contract-api';


@FabricObject()
export class UniqueEntry {
    @Property()
    barcode: string;
    @Property()
    uniqueID: string;
    @Property()
    hash: string;
}