exports.shipGoldTo = async (req, res) => {
    try {
        const contract = req.contract;
        const shipDetails = req.body;

        //Modal of shipDetails
        // shipDetails = {
        //     barcode,
        //     newLocation,
        //     arrivalDate
        // };

        shipDetails.arrivalDate=Date.now()
        const result = await contract.submitTransaction('shipGoldTo',
            shipDetails.barcode,
            shipDetails.newLocation,
            shipDetails.arrivalDate);

        // console.log(result.toString());
        res.json({ status: 'Transaction submitted.' });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
}