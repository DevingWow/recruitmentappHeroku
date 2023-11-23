const express = require('express');
const router = express.Router();

const loginrouter = require('./login');

router.use('/login', loginrouter);

module.exports = router;
