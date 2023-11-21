const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');

const DEFAULT_PORT = '8000';

require('dotenv').config({
    path: path.join(APP_ROOT_DIR, '.env')
});


const express = require('express');
const app = express();

app.get('/', async (req,res) => {
    res.send('welcome to auth micro!\n');
});


const server = app.listen(
    process.env.PORT||DEFAULT_PORT, () => {
        console.log('Server is up');
    }
)
