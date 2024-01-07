const express = require('express');
const router = express.Router();
const { adduser } = require('../stockdb');

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const test = await adduser(email);
        if (test) {
            res.status(200).json({ status: true, message: 'Stocks listed successfully', userexist: test });
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
