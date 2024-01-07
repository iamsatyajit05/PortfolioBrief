const express = require('express');
const router = express.Router();
const { userNews, fetchedNews } = require('../stockdb');

router.get('/', async (req, res) => {
    try {
        // TODO: Delete other file and use those logic directly in endpoint code block
        // const client = new MongoClient(MONGODB_URI);
        // const dbName = 'test';
        // const collectionName = 'news';

        // await client.connect();
        // console.log('Connected successfully to server');

        // const db = client.db(dbName);
        // const collection = db.collection(collectionName);

        // const documents = await collection.find({}).toArray();

        // /*const yesterday = new Date();
        // yesterday.setDate(yesterday.getDate() - 1);
        // yesterday.setHours(9, 0, 0, 0);

        const fetchedNewsData = await collection.find({}).toArray();;

        if (fetchedNewsData) {
            res.status(200).json({ status: true, message: 'News listed successfully', news: fetchedNewsData });
        } else {
            res.status(404).json({ message: 'News not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:userId', async (req, res) => {
    const { email } = req.params.body;

    try {
        const news = await userNews(email);

        if (news.length > 0) {
            res.status(200).json({ status: true, message: 'Stocks listed successfully', news: news });
        } else if (news.length === 0) {
            res.status(404).json({ status: false, message: 'Empty news' });
        } else {
            res.status(404).json({ status: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

module.exports = router;
