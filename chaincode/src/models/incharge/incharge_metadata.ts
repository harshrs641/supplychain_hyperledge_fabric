import { Object as FabricObject, Property } from 'fabric-contract-api';
import { InChargeEntry } from './incharge_entry';



@FabricObject()
export class InChargeMetaData {
    @Property('previous', 'Array<InChargeEntry>')
    previous: InChargeEntry[]=[];

    @Property('current', 'InChargeEntry')
    current: InChargeEntry;
}