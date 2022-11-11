import { Object as FabricObject, Property } from 'fabric-contract-api';


@FabricObject()
export class AmounteEntry {
  
    @Property()
    rate: number;

    @Property()
    grossAmount: number;

    @Property()
    netAmount: number;
        
    @Property()
    tax: number;
}