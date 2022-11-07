import { Object as FabricObject, Property } from 'fabric-contract-api';
import { LocationData } from './gold-location-data';
import { InCharge } from './in-charge';

@FabricObject()
export class Gold {

    /// UNIQUE
    // @Property()
    // id: string;
    @Property()
    barcode: string;
    @Property()
    uniqueID: string;
    @Property()
    hash: string;

    @Property('componentIds', 'Array<string>')
    componentIds: string[];

    // @Property()
    // placeOfOrigin: string;

    @Property()
    creationDate: number;

    @Property()
    unitQuantity: number;

    @Property()
    weight: number;

    @Property()
    purity: number;

    @Property()
    form: string;

    @Property('locationData', 'LocationData')
    locationData: LocationData;

    @Property()
    note: string;

    @Property('currentInCharge', 'InCharge')
    currentInCharge: InCharge;

    @Property('inCharge', 'Array<InCharge>')
    previousInCharge: InCharge[];
}

// enum GoldForm {
//     BALL = 0, BAR = 1, MELT = 2, ORIGINAL = 3,
// }