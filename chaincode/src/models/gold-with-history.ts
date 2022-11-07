import { Object as FabricObject, Property } from 'fabric-contract-api';
import { Gold } from './gold_entry';

@FabricObject()
export class GoldWithHistory extends Gold {
    constructor(gold?: Gold) {
        super();
        Object.assign(this, gold);
    }

    @Property('componentGolds', 'Array<GoldWithHistory>')
    component: GoldWithHistory[];
}
