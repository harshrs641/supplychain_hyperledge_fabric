import { Object as FabricObject, Property } from 'fabric-contract-api';
import { ProcessEntry } from './process_entry';


@FabricObject()
export class ProcessMetaData {
    @Property('previous', 'Array<ProcessEntry>')
    previous: ProcessEntry[]=[];

    @Property('current', 'ProcessEntry')
    current: ProcessEntry;
}