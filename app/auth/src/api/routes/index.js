const express = require('express');
const router = express.Router();

const loginrouter = require('./login');

const entry = router.get('/', async (req,res) => {
    res.send('welcome to auth micro!\n');
});


router.use('/login', loginrouter);
router.use('/', entry);

module.exports = router;
