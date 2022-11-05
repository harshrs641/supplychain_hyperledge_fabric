'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const network = require('./fabric/network');

const barcode = require('barcode');



let crypto;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    console.log('GET called');
    res.send('Hello world!');
});

app.get('/getProduct', network.connectToNetwork, async (req, res) => {
  
    try{
        
        const contract = req.contract;
        const productId = req.query.id.toString();
        
        const result = await contract.evaluateTransaction('getGoldData', productId);
        const response = JSON.parse(result.toString());
        console.log(response);
        res.json({ result: response });
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.post('/createGold', network.connectToNetwork, async (req, res) => {
    try{
        if(!crypto){
            crypto=(await import('crypto-random-string')).default;
        }
    

        const contract = req.contract;
        req.body.barcode= crypto({length: 12, type: 'numeric'});
        req.body.hash=crypto({length: 32, type: 'base64'});
        req.body.id=crypto({length: 10,});
        const productJson = JSON.stringify(req.body);

        console.log(productJson);

        const result = await contract.submitTransaction('createGold', productJson);
        console.log(result.toString());
        res.json( {result: result} );
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.get('/getProductWithHistory', network.connectToNetwork, async (req, res) => {
    try{
        const contract = req.contract;
        const productId = req.query.id.toString();
        
        const result = await contract.evaluateTransaction('getGoldWithHistory', productId);
        const response = JSON.parse(result.toString());
        console.log(response);
        res.json({ result: response });
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.get('/productExists', network.connectToNetwork, async (req, res) => {
    try{
        const contract = req.contract;
        const productId = req.query.id.toString();
        console.log(productId);

        const result = await contract.evaluateTransaction('goldExists', productId);
        console.log(result.toString());
        res.json({ exists: result.toString() });
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});

app.post('/shipProduct', network.connectToNetwork, async (req, res) => {
    try{
        const contract = req.contract;
        const shipDetails = req.body;

        //Modal of shipDetails
        // shipDetails = {
        //     productId,
        //     newLocation,
        //     arrivalDate
        // };

        const result = await contract.submitTransaction('shipGoldTo', 
            shipDetails.productId, 
            shipDetails.newLocation,
            shipDetails.arrivalDate);
        
        console.log(result.toString());
        res.json({ status: 'Transaction submitted.', txId: result.toString()});
    } catch(error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
});
const PORT=3005;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});