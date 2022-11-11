import { Object as FabricObject, Property } from 'fabric-contract-api';
import { AmounteEntry } from './amount_entry';
import { InChargeMetaData } from './incharge/incharge_metadata';
import { ProcessMetaData } from './process/process_metadata';
import { QualityEntry } from './quality_entry';
import { ShippingMetaData } from './shipping/shipping_metadata';
import { UniqueEntry } from './unique_entry';
import { VerificationMetaData } from './verification/verification_metadata';


@FabricObject()
export class Gold {

    @Property('componentIds', 'Array<string>')
    componentIds: string[];

    @Property()
    merchantID: string;

    @Property()
    creationDate: number;

    @Property()
    note: string;

    @Property('incharge', 'InChargeMetaData')
    incharge: InChargeMetaData;

    @Property('process', 'ProcessMetaData')
    process: ProcessMetaData;

    @Property('shipping', 'ShippingMetaData')
    shipping: ShippingMetaData;

    @Property('verification', 'VerificationMetaData')
    verification: VerificationMetaData;

    @Property('unique', 'UniqueEntry')
    unique: UniqueEntry;

    @Property('qualtiy', 'QualityEntry')
    properties: QualityEntry;

    @Property('amount', 'AmounteEntry')
    amount: AmounteEntry;


}

// enum GoldForm {
//     BALL = 0, BAR = 1, MELT = 2, ORIGINAL = 3,
// }

