require('dotenv').config();
const { mongoDBInstance } = require('./mongodb');
const { createTransport } = require('nodemailer');

function formatTime(timeString) {
    const dateObj = new Date(timeString);

    const monthAbbreviations = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const formattedDate = `${dateObj.getDate()} ${monthAbbreviations[dateObj.getMonth()]}`;

    return formattedDate;
}

function structureEmail(data) {
    let newsContent = "";

    for (let i = 0; i < data.news.length; i++) {
        let sourceContent = null;

                        if (newsItem.href && newsItem.href.includes("https://www.livemint.com")) {
                            sourceContent = (
                                `<span className='text-gray-500 text-sm mt-2'>
                                    • LiveMint
                                </span>`
                            );
                        }
                        else if (newsItem.href && newsItem.href.includes("https://www.moneycontrol.com")) {
                            sourceContent = (
                                `<span className='text-gray-500 text-sm mt-2'>
                                    • MoneyControl
                                </span>`
                            );
                        }

        const news = `
        <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; gap: 4px; padding-top: 18px;">
                <div class="news" style="margin: 0; padding: 0; font-family: Arial, sans-serif; text-align: left; width: auto;">
        <a href="${data.news[i].href}" target="_blank">${data.news[i].innerText}</a><p></p>
        <div>
        <span style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 14px;">${formatTime(data.news[i].newsTime)}</span> • <span class="tag" style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 14px;">${data.news[i].tag}</span>
        • <span class="tag" style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 14px;">${sourceContent}</span>
        </div>
        </div>
        <img src="${data.news[i].imageUrl}" alt="News Image" style="margin: 0; padding: 0; font-family: Arial, sans-serif; width: 80px; height: 80px;" width="80" height="80"></div>
        `;
        newsContent += news;
    }

    if(data.news.length === 0) {
        newsContent = `
        <div  style="margin: 0; padding: 0; font-family: Arial, sans-serif; padding-top: 18px">
            <p>404_news.png, sorry there was no news update for your selected stocks.</p>
            <p style="margin-top: 16px;">We are working hard so you don't get message like this again :)</p>
    </div>
    `
    }

    const email = {
        'to': data.user,
        'subject': 'DailyBrief of Your Portfolio',
        'html': `
        <div style="padding: 0; font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; overflow: hidden; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
        <div style="margin: 0; font-family: Arial, sans-serif; background-color: rgba(6, 182, 212); color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; padding: 0; font-family: Arial, sans-serif;"><a href="https://portfoliobrief-frontend.vercel.app/" style="margin: 0; padding: 0; font-family: Arial, sans-serif; text-decoration: none; color: #fff; font-size: 30px;">📰Portfoliobrief</a></h2>
        </div>
    
        <div style="margin: 0; font-family: Arial, sans-serif; padding: 40px 20px;">
            <p style="margin: 0; padding: 0; font-family: Arial, sans-serif;">Hey buddy, idk what to write here as intro so just asking you to enjoy this edition and give feedback to us if possiable!</p>
        </div>
    
        <hr style="padding: 0; font-family: Arial, sans-serif; width: 112px; margin: auto;">
    
        <div style="margin: 0; font-family: Arial, sans-serif; padding: 40px 20px;">
            <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 28px; margin-bottom: 12px; text-align: center;">Dailybrief</div>
            ${newsContent}
        </div>
    
        <hr style="padding: 0; font-family: Arial, sans-serif; width: 112px; margin: auto;">
    
        <div style="margin: 0; font-family: Arial, sans-serif; padding: 40px 20px;">
            <p style="margin: 0; padding: 0; font-family: Arial, sans-serif;">Thank you for taking the time to read this newsletter.</p>
            <p style="margin: 0; padding: 0; font-family: Arial, sans-serif; margin-top: 16px;">once_again_asking.png (lol) to give your feedback how we can imrpove are queality of newsletter to make your day more better.</p>
        </div>
    
        <div style="margin: 0; font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: rgba(6, 182, 212); color: #fff;">
            <p style="margin: 0; padding: 0; font-family: Arial, sans-serif;">You are receiving this email because you registered to our newsletter.</p>
            <p style="padding: 0; font-family: Arial, sans-serif; margin: 8px 0;"> To stop reciving, <a href="https://portfoliobrief-frontend.vercel.app/stop-email" style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #fff;">click here</a>.</p>
            <p style="margin: 0; padding: 0; font-family: Arial, sans-serif;">&copy; 2023 Portfoliobrief. All rights reserved.</p>
        </div>
        </div>
        `
    }

    return email;
}

async function fetchNews() {
    try {
        const client = await mongoDBInstance.getClient();
        console.log('Connected successfully to server');

        const dbName = 'test';
        const collectionName = 'news';

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(9, 0, 0, 0);

        const filteredData = documents.filter(item => new Date(item.newsTime) > yesterday);
        return filteredData;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchStocklist() {
    try {
        const client = await mongoDBInstance.getClient();
        console.log('Connected successfully to server');

        const dbName = 'test';
        const collectionName = 'stocklists';

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();
        return documents;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function sendData() {
    const stocklist = await fetchStocklist();
    const news = await fetchNews();
    try {
        for (let i = 0; i < stocklist.length; i++) {
            const addToEmail = {
                'user': stocklist[i].userEmail,
                'stockslist': stocklist[i].selectedStocks,
                'news': []
            };

            for (let j = 0; j < news.length; j++) {
                for (let k = 0; k <= stocklist[i].selectedStocks.length; k++) {
                    if (stocklist[i].selectedStocks[k] == news[j].tag) {
                        console.log(stocklist[i].selectedStocks[k], news[j].tag);

                        addToEmail.news.push(news[j]);

                    }
                }
            }
            console.log("this is ", addToEmail);
            const emailContent = await structureEmail(addToEmail)
            if(emailContent.to === "mannbhattco34@gmail.com"){
                await sendEmail(emailContent)
            }
        }
    }
    catch (err) {
        console.log("Error:", err);
    }
}

async function sendEmail(data) {
    try {
        const transporter = createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'Satyajit from PortfolioBrief ' + 'thisissatyajit05@gmail.com',
            to: data.to,
            subject: data.subject,
            html: data.html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

sendData();