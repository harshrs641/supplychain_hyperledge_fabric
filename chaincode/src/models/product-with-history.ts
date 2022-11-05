import { Object as FabricObject, Property } from 'fabric-contract-api';
import { Gold } from './product';

@FabricObject()
export class GoldWithHistory extends Gold {
    constructor(product?: Gold) {
        super();
        Object.assign(this, product);
    }

    @Property('componentProducts', 'Array<GoldWithHistory>')
    component: GoldWithHistory[];
}
