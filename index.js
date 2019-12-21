require('dotenv').config();
const express = require('express');
const cors = require('cors');
const converterRoute = require('./routes/convert');
const helmet = require('helmet');

const app = express();

app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(express.json());

app.use(cors({ optionSuccessStatus: 200 }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.use('/api/convert', converterRoute);

const port = process.env.PORT || 8000;
const listener = app.listen(port, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
