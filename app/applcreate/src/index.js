const path = require('path');
const APP_ROOT_DIR = path.resolve(__dirname, '..');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const routes = require('./api/index')

require('dotenv').config({
    path: path.join(APP_ROOT_DIR, '.env') 
});



const express = require('express');
const { errorLogger } = require('./middleware/loggers');
const errorHandler = require('./middleware/errorhandler');
const mqInstance = require('./mq/MessageBroker');
mqInstance.connect();
const DEFAULT_PORT = 8060;
const args = process.argv.slice(2);
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieparser());

//add use routes here
app.use(routes);

app.use(errorLogger);
app.use(errorHandler);

const port = process.env.PORT || args[0] || DEFAULT_PORT;

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});