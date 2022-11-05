/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Gold } from './models/product';
import { LocationEntry } from './models/product-location-entry';
import { GoldWithHistory } from './models/product-with-history';

@Info({ title: 'ProductSupplyChain', description: 'Smart Contract for handling product supply chain.' })
export class ProductSupplyChainContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async goldExists(ctx: Context, id: string): Promise<boolean> {
        const data = await ctx.stub.getState(id);
        return (!!data && data.length > 0);
    }

    @Transaction()
    @Returns('string')
    public async createGold(ctx: Context, productJson: string): Promise<string> {
        const gold = JSON.parse(productJson) as Gold;


        // const exists: boolean = await this.productExists(ctx, product.id);
        // if (exists) {
        //     throw new Error(`The product ${product.id} already exists.`);
        // }
        // let id = uuidv4();
        // gold.id = id;
        /// NEED THIS
        // product.barcode = id;
        // product.hash = id;
        // product.uniqueID = id;
        // gold.creationDate = Date.now();

        this.requireField(gold.weight, 'weight');
        this.requireField(gold.weight, 'weight');
        this.requireField(gold.creationDate, 'creationDate');

        this.requireField(gold.form, 'form');
        this.requireField(gold.carrat, 'carrat');
        this.requireField(gold.currentInCharge, 'currentInCharge');

        this.requireField(gold.unitQuantity, 'unitQuantity');

        this.requireField(gold.locationData.current.location, 'locationData.current.location');
        this.requireField(gold.locationData.current.arrivalDate, 'locationData.current.arrivalDate');

        const buffer = Buffer.from(JSON.stringify(gold));
        await ctx.stub.putState(gold.id, buffer);

        return gold.id;
    }

    @Transaction()
    public async shipGoldTo(ctx: Context, id: string, newLocation: string,): Promise<void> {
        const exists: boolean = await this.goldExists(ctx, id);
        if (!exists) {
            throw new Error(`The product ${id} does not exist.`);
        }

        this.requireField(newLocation, 'newLocation');


        const gold = await this.readGoldData(ctx, id);

        gold.locationData.previous.push(new LocationEntry({
            arrivalDate: gold.locationData.current.arrivalDate,
            location: gold.locationData.current.location
        }));
 
        gold.locationData.current.location = newLocation;

        const buffer = Buffer.from(JSON.stringify(gold));
        await ctx.stub.putState(id, buffer);
    }

    @Transaction(false)
    @Returns('Gold')
    public async getGoldData(ctx: Context, id: string): Promise<Gold> {
        const exists: boolean = await this.goldExists(ctx, id);
        if (!exists) {
            throw new Error(`The product ${id} does not exist.`);
        }

        return this.readGoldData(ctx, id);
    }

    @Transaction(false)
    @Returns('GoldHistory')
    public async getGoldWithHistory(ctx: Context, id: string): Promise<GoldWithHistory> {
        const exists: boolean = await this.goldExists(ctx, id);
        if (!exists) {
            throw new Error(`The product ${id} does not exist.`);
        }

        const gold = await this.readGoldData(ctx, id);
        const goldWithHistory = new GoldWithHistory(gold);
        goldWithHistory.component = [];
        // let componentIds = [];
        // let goldComponentIds = gold;

        for (const childGoldId of gold.componentIds) {
            const childGold = await this.readGoldData(ctx, childGoldId);
            // goldWithHistory.component.push(childGold);
            goldWithHistory.component.push(await this.getChildGoldHistory(ctx, childGold));
        }
        return goldWithHistory;
    }


    @Transaction(false)
    @Returns('GoldWithHistory')
    private async getChildGoldHistory(ctx: Context, childGold: Gold): Promise<GoldWithHistory> {
        const goldWithHistory = new GoldWithHistory(childGold);
        goldWithHistory.component = [];
        if (childGold.componentIds.length != 0) {
            for (const childGoldComponentsId of childGold.componentIds) {
                const childGoldComponent = await this.readGoldData(ctx, childGoldComponentsId);
                goldWithHistory.component.push(await this.getChildGoldHistory(ctx, childGoldComponent));
               
            }
        }
        return goldWithHistory;
    }

    private async readGoldData(ctx: Context, id: string): Promise<Gold> {
        const data = await ctx.stub.getState(id);
        const product = JSON.parse(data.toString()) as Gold;

        return product;
    }

    private requireField(value, fieldName: string) {
        if (!value) {
            throw new Error(`The '${fieldName}' field is required.`);
        }
    }
}
