const express = require('express');
const router = express.Router();
const { stockSaveToDB, updateStocks } = require('../stockdb');

router.post('/', async (req, res) => {
    const { stocks, userEmail } = req.body;

    try {
        const result = await stockSaveToDB(stocks, userEmail);

        if (result.status) {
            res.status(200).json({ message: 'Function executed and data saved', user: result.user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/', async (req, res) => {
    const { email } = req.body;

    try {
        const listedStocks = await updateStocks(email);

        if (listedStocks) {
            if (typeof listedStocks[0] === 'undefined') {
                res.status(200).json({ status: true, message: 'Stocks listed successfully', stocks: [] });
            } else {
                res.status(200).json({ status: true, message: 'Stocks listed successfully', stocks: listedStocks[0].selectedStocks });
            }
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;