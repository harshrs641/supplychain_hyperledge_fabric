'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const network = require('./fabric/network');


const { createGoldEntry, getGoldEntryDetail, getGoldEntryHistory, goldEntryExists, queryGoldEntry } = require('./controllers/details');
const { shipGoldTo } = require('./controllers/shipping');
const { changeCurrentIncharge } = require('./controllers/incharge');




app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    console.log('GET called');
    res.send('Hello world!');
});

app.post('/createGoldEntry', network.connectToNetwork, createGoldEntry);

app.get('/getGoldEntryDetail', network.connectToNetwork, getGoldEntryDetail);

app.get('/getGoldEntryWithHistory', network.connectToNetwork, getGoldEntryHistory);

app.get('/goldEntryExists', network.connectToNetwork, goldEntryExists);

app.patch('/shipGoldTo', network.connectToNetwork, shipGoldTo);

app.patch('/changeInCharge', network.connectToNetwork, changeCurrentIncharge);

app.post('/queryGoldEntry', network.connectToNetwork, queryGoldEntry);





const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});