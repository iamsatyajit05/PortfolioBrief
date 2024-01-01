require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const { stockSaveToDB, updateStocks, savePreference, fetchedNews, adduser } = require('./stockdb');
const { userNews } = require('./sendResNews');

// dedicated to web3 world
app.get('/gm', (req, res) => {
    res.send('GM!');
});

// Save stocks list
app.post('/api/stocks', async (req, res) => {
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

// Update stocks list
app.put('/api/stocks', async (req, res) => {
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

// Save user
app.post('/api/users', async (req, res) => {
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

// Save preference
app.post('/api/preference', async (req, res) => {
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

// All news
app.get('/api/news', async (req, res) => {
    const { email } = req.body;

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

// News selected by user
app.get('/api/news/:userId', async (req, res) => {
    try {
        const fetchedNewsData = await fetchedNews();

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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});