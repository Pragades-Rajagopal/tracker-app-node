const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');
const router = require('./routers/router');

const app = express();
const PORT = 9194;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use("/public", express.static(__dirname + "/public"));

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: false}));

app.use(router);

app.listen(PORT, () => {
    console.log("app is running in port: ", PORT);
});

