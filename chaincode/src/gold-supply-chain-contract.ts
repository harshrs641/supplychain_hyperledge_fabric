/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';

import { Gold } from './models/gold_entry';

import { GoldWithHistory } from './models/gold-with-history';
import { Iterators } from 'fabric-shim';
import { ShippingEntry } from './models/shipping/shipping_entry';
import { InChargeEntry } from './models/incharge/incharge_entry';
import { ProcessEntry } from './models/process/process_entry';
import { VerificationEntry } from './models/verification/verification_entry';

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

        const exists: boolean = await this.goldExists(ctx, gold.unique.barcode);
        if (exists) {
            throw new Error(`The gold ${gold.unique.barcode} already exists.`);
        }

        const buffer = Buffer.from(JSON.stringify(gold));

        await ctx.stub.putState(gold.unique.barcode, buffer);

        return gold.unique.barcode;
    }

    @Transaction()
    public async changeGoldShipment(ctx: Context, barcode: string, shippingJson: string): Promise<void> {
        const shipping = JSON.parse(shippingJson) as ShippingEntry;
        const exists: boolean = await this.goldExists(ctx, barcode);
        if (!exists) {
            throw new Error(`The gold ${barcode} does not exist.`);
        }



        const gold = await this.readGoldDataFromBarcode(ctx, barcode);

        gold.shipping.previous.push(gold.shipping.current);

        gold.shipping.current = shipping;

        const buffer = Buffer.from(JSON.stringify(gold));
        await ctx.stub.putState(barcode, buffer);
    }

    @Transaction()
    public async changeGoldIncharge(ctx: Context, barcode: string, inChargeJson: string,): Promise<void> {
        const exists: boolean = await this.goldExists(ctx, barcode);
        if (!exists) {
            throw new Error(`The gold ${barcode} does not exist.`);
        }
        const inCharge = JSON.parse(inChargeJson) as InChargeEntry;



        const gold = await this.readGoldDataFromBarcode(ctx, barcode);

        if (gold.incharge.current.captain.mongoDBId != inCharge.captain.mongoDBId || gold.incharge.current.self.mongoDBId != inCharge.self.mongoDBId) {
            gold.incharge.previous.push(gold.incharge.current);
        }
        gold.incharge.current = inCharge;



        const buffer = Buffer.from(JSON.stringify(gold));
        await ctx.stub.putState(barcode, buffer);
    }

    @Transaction()
    public async changeGoldProcess(ctx: Context, barcode: string, processJson: string,): Promise<void> {
        const exists: boolean = await this.goldExists(ctx, barcode);
        if (!exists) {
            throw new Error(`The gold ${barcode} does not exist.`);
        }
        const process = JSON.parse(processJson) as ProcessEntry;



        const gold = await this.readGoldDataFromBarcode(ctx, barcode);

        gold.process.previous.push(gold.process.current);

        gold.process.current = process;

        const buffer = Buffer.from(JSON.stringify(gold));
        await ctx.stub.putState(barcode, buffer);
    }


    @Transaction()
    public async changeGoldVerification(ctx: Context, barcode: string, verificationJson: string,): Promise<void> {
        const exists: boolean = await this.goldExists(ctx, barcode);
        if (!exists) {
            throw new Error(`The gold ${barcode} does not exist.`);
        }
        const verification = JSON.parse(verificationJson) as VerificationEntry;



        const gold = await this.readGoldDataFromBarcode(ctx, barcode);

        gold.verification.previous.push(gold.verification.current);

        gold.verification.current = verification;

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
    @Returns('Gold[]')
    public async getqueryGoldData(ctx: Context, query: string): Promise<Gold[]> {
        const result = await ctx.stub.getQueryResult(query);
        const iterator = await this.getIteratorResult(result);
        return iterator;
    }

    private async getIteratorResult(iterator: Iterators.StateQueryIterator): Promise<Gold[]> {
        const allResults = [];
        while (true) {

            const res = await iterator.next();
            if (res.value) {
                allResults.push(JSON.parse(res.value.value.toString()) as Gold);
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
