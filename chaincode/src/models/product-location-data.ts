import { Object as FabricObject, Property } from 'fabric-contract-api';
import { LocationEntry  } from './product-location-entry';

@FabricObject()
export class LocationData {
    @Property('previous', 'Array<LocationEntry>')
    previous: LocationEntry[];

    @Property()
    current: LocationEntry;
}