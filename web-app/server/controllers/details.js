
let crypto;
exports.createGoldEntry = async (req, res) => {
    try {

        if (!crypto) {

            crypto = (await import('crypto-random-string')).default;

        }

        const contract = req.contract;

        req.body.barcode = crypto({ length: 12, type: 'numeric' });

        req.body.hash = crypto({ length: 32, type: 'base64' });
        req.body.creationDate = Date.now()
        req.body.locationData.current.arrivalDate = Date.now()
        req.body.currentInCharge.assignedDate = Date.now()
        const goldEntryJson = JSON.stringify(req.body);

        const result = await contract.submitTransaction('createGold', goldEntryJson);

        console.log(result.toString());

        res.json({ barcode: result.toString() });

    } catch (error) {

        console.error(`Failed to evaluate transaction: ${error}`);

        res.status(500).json({
            error: error
        });

    }
}



exports.getGoldEntryDetail = async (req, res) => {

    try {

        const contract = req.contract;

        const barcode = req.query.barcode.toString();

        const result = await contract.evaluateTransaction('getGoldData', barcode);

        const response = JSON.parse(result.toString());


        res.json({ result: response });

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
}


exports.getGoldEntryHistory = async (req, res) => {
    try {

        const contract = req.contract;

        const barcode = req.query.barcode.toString();

        const result = await contract.evaluateTransaction('getGoldWithHistory', barcode);

        const response = JSON.parse(result.toString());

        res.json({ result: response });

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
}


exports.goldEntryExists = async (req, res) => {
    try {
        const contract = req.contract;
        const barcode = req.query.barcode.toString();


        const result = await contract.evaluateTransaction('goldExists', barcode);

        res.json({ exists: result.toString() });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
}

exports.queryGoldEntry = async (req, res) => {
    try {
        const contract = req.contract;
        const query = JSON.stringify(req.body);

        const result = await contract.evaluateTransaction('getqueryGoldData', `{"selector": ${query}}`);

        let exists = false;
        if (JSON.parse(result).length !== 0) {
            exists = true;
        }
        res.json({ exists: exists, result: JSON.parse(result) });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
}