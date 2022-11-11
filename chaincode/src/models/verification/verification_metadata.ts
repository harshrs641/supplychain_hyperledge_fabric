import { Object as FabricObject, Property } from 'fabric-contract-api';
import { VerificationEntry } from './verification_entry';


@FabricObject()
export class VerificationMetaData {
    @Property('previous', 'Array<VerificationEntry>')
    previous: VerificationEntry[]=[];

    @Property('current', 'VerificationEntry')
    current: VerificationEntry;
}