const express = require('express');
const router = express.Router();
const { savePreference } = require('../stockdb');

router.post('/', async (req, res) => {
    try {
        const { recieveNewsText, newsTypeText, email } = req.body;

        const response = await savePreference({ recieveNewsText, newsTypeText, email })

        if (response.status) {
            res.status(200).json({ message: 'Data saved successfully' });
        } else {
            throw response.message;
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred while saving data' });
    }
});

module.exports = router;
