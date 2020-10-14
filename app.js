const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connexion à MongoDb réussie !'))
    .catch(() => console.log('Connexion à MongoDb échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100 // limiter chaque IP à 100 requêtes
});

app.use(bodyParser.json());

app.use(limiter);
app.use(helmet());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;