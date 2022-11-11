import { Object as FabricObject, Property } from 'fabric-contract-api';
import { ShippingEntry } from './shipping_entry';


@FabricObject()
export class ShippingMetaData {
    @Property('previous', 'Array<ShippingEntry>')
    previous: ShippingEntry[]=[];

    @Property('current', 'ShippingEntry')
    current: ShippingEntry;
}