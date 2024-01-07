require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const stocksRoutes = require('./routes/stocks');
const usersRoutes = require('./routes/users');
const preferenceRoutes = require('./routes/preference');
const newsRoutes = require('./routes/news');

app.get('/gm', (req, res) => {
    res.send('GM!');
});

app.use('/api/stocks', stocksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/preference', preferenceRoutes);
app.use('/api/news', newsRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});