/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { InCharge } from './models/in-charge';
import { Gold } from './models/gold_entry';
import { LocationEntry } from './models/gold-location-entry';
import { GoldWithHistory } from './models/gold-with-history';
import { Iterators } from 'fabric-shim';

@Info({ title: 'GoldSupplyChain', description: 'Smart Contract for handling gold supply chain.' })
export class GoldSupplyChainContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async goldExists(ctx: Context, barcode: string): Promise<boolean> {
        const data = await ctx.stub.getState(barcode);
        return (!!data && data.length > 0);
    }

    @Transaction()
    @Returns('string')
    public async createGold(ctx: Context, goldDataJson: string): Promise<string> {
        const gold = JSON.parse(goldDataJson) as Gold;


        const exists: boolean = await this.goldExists(ctx, gold.barcode);
        if (exists) {
            throw new Error(`The gold ${gold.barcode} already exists.`);
        }


        gold.previousInCharge = [];
        gold.locationData.previous = []
        this.requireField(gold.weight, 'weight');
        this.requireField(gold.purity, 'purity');
        this.requireField(gold.creationDate, 'creationDate');

        this.requireField(gold.form, 'form');

        this.requireField(gold.currentInCharge, 'currentInCharge');


        this.requireField(gold.locationData.current.location, 'locationData.current.location');
        this.requireField(gold.locationData.current.arrivalDate, 'locationData.current.arrivalDate');

        const buffer = Buffer.from(JSON.stringify(gold));

        await ctx.stub.putState(gold.barcode, buffer);

        return gold.barcode;
    }

    @Transaction()
    public async shipGoldTo(ctx: Context, barcode: string, newLocation: string, arrivalDate: number): Promise<void> {
        const exists: boolean = await this.goldExists(ctx, barcode);
        if (!exists) {
            throw new Error(`The gold ${barcode} does not exist.`);
        }

        this.requireField(newLocation, 'newLocation');


        const gold = await this.readGoldDataFromBarcode(ctx, barcode);

        gold.locationData.previous.push(new LocationEntry({
            arrivalDate: gold.locationData.current.arrivalDate,
            location: gold.locationData.current.location
        }));

        gold.locationData.current.location = newLocation;
        gold.locationData.current.arrivalDate = arrivalDate;

        const buffer = Buffer.from(JSON.stringify(gold));
        await ctx.stub.putState(barcode, buffer);
    }

    @Transaction()
    public async changeGoldIncharge(ctx: Context, barcode: string, inChargeJson: string,): Promise<void> {
        const exists: boolean = await this.goldExists(ctx, barcode);
        if (!exists) {
            throw new Error(`The gold ${barcode} does not exist.`);
        }
        const inCharge = JSON.parse(inChargeJson) as InCharge;
        this.requireField(inCharge.type, 'type');
        this.requireField(inCharge.mongoDBId, 'mongoDBId');


        const gold = await this.readGoldDataFromBarcode(ctx, barcode);
        if (gold.previousInCharge == null) {
            gold.previousInCharge = [];
        }
        gold.previousInCharge.push(gold.currentInCharge);

        gold.currentInCharge = inCharge;

        const buffer = Buffer.from(JSON.stringify(gold));
        await ctx.stub.putState(barcode, buffer);
    }

    @Transaction(false)
    @Returns('Gold')
    public async getGoldData(ctx: Context, barcode: string): Promise<Gold> {
        const exists: boolean = await this.goldExists(ctx, barcode);
        if (!exists) {
            throw new Error(`The gold ${barcode} does not exist.`);
        }

        const gold = await this.readGoldDataFromBarcode(ctx, barcode);
        const goldWithHistory = new GoldWithHistory(gold);
        goldWithHistory.component = []
        for (const componentId of gold.componentIds) {
            const component = await this.readGoldDataFromBarcode(ctx, componentId);
            goldWithHistory.component.push(new GoldWithHistory(component));
        }

        return goldWithHistory;
    }


    @Transaction(false)
    @Returns('Gold[]')
    public async getqueryGoldData(ctx: Context, query: string) :Promise<Gold[]>{
        const result = await ctx.stub.getQueryResult(query);
        const iterator = await this.getIteratorResult(result);
        return iterator;
    }
    private async getIteratorResult(iterator: Iterators.StateQueryIterator):Promise<Gold[]> {
        const allResults = [];
        while (true) {
            
            const res = await iterator.next();
            if (res.value) {
                allResults.push(JSON.parse( res.value.value.toString()) as Gold);
            }

            // check to see if we have reached then end
            if (res.done) {
                // close the iterator            
                await iterator.close();
                return allResults;
            }
        }
    }

    @Transaction(false)
    @Returns('GoldHistory')
    public async getGoldWithHistory(ctx: Context, barcode: string): Promise<GoldWithHistory> {
        const exists: boolean = await this.goldExists(ctx, barcode);
        if (!exists) {
            throw new Error(`The gold ${barcode} does not exist.`);
        }

        const gold = await this.readGoldDataFromBarcode(ctx, barcode);
        const goldWithHistory = new GoldWithHistory(gold);
        goldWithHistory.component = [];
        // let componentIds = [];
        // let goldComponentIds = gold;

        for (const childGoldId of gold.componentIds) {
            const childGold = await this.readGoldDataFromBarcode(ctx, childGoldId);
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
                const childGoldComponent = await this.readGoldDataFromBarcode(ctx, childGoldComponentsId);
                goldWithHistory.component.push(await this.getChildGoldHistory(ctx, childGoldComponent));

            }
        }
        return goldWithHistory;
    }

    // private async readGoldData(ctx: Context, id: string): Promise<Gold> {
    //     const data = await ctx.stub.getState(id);
    //     const gold = JSON.parse(data.toString()) as Gold;

    //     return gold;
    // }

    private async readGoldDataFromBarcode(ctx: Context, barcode: string): Promise<Gold> {
        const data = await ctx.stub.getState(barcode);
        const gold = JSON.parse(data.toString()) as Gold;

        return gold;
    }

    private requireField(value, fieldName: string) {
        if (!value) {
            throw new Error(`The '${fieldName}' field is required.`);
        }
    }
}
