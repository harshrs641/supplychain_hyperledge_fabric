exports.changeCurrentIncharge = async (req, res) => {
    try {
        const contract = req.contract;

        const incharge = req.body;
        const barcode = incharge.barcode;

        incharge.assignedDate = Date.now()
        incharge.barcode = undefined;
        const inchargeJson = JSON.stringify(incharge);
        const result = await contract.submitTransaction('changeGoldIncharge',
            barcode,
            inchargeJson);

        console.log(result.toString());

        res.json({ status: 'Transaction submitted.', txId: result.toString() });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
    }
}