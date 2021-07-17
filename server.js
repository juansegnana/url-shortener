const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const URL_MONGODB = `mongodb+srv://admin:${process.env.DB_PASS}@discordjs-bot.dhfpg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(URL_MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});

app.get('/:shortUrl', async(req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (!shortUrl) return res.sendStatus(404);
    
    shortUrl.clicks++;
    await shortUrl.save();
    
    res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);