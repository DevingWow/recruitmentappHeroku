const express = require('express');
const router = express.Router();

const authcheckrouter = require('./authcheck');
const loginrouter = require('./login');
const registrationrouter = require('./registration');
const logoutrouter = require('./logout');

const entry = router.get('/', async (req,res) => {
    try {
        res.send('welcome to auth micro!\n');
    } catch (error) {
        next(error);
    }    
});

router.use('/check_auth', authcheckrouter);
router.use('/login', loginrouter);
router.use('/logout', logoutrouter);
router.use('/register', registrationrouter);
router.use('/', entry);

module.exports = router;
