import { Object as FabricObject, Property } from 'fabric-contract-api';
import { Metadata } from '../metadata';

@FabricObject()
export class VerificationEntry {
  
    @Property('managedBy','Metadata')
    managedBy: Metadata;

    @Property()
    date: number;

    @Property()
    status: string;
}