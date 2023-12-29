const express = require('express');
const router = express.Router();

const authcheckrouter = require('./authcheck');
const loginrouter = require('./login');
const registrationrouter = require('./registration');
const logoutrouter = require('./logout');



router.use('/check_auth', authcheckrouter);
router.use('/login', loginrouter);
router.use('/logout', logoutrouter);
router.use('/register', registrationrouter);

const entry = router.get('/', async (req,res) => {
    try {
        res.send('welcome to auth micro!\n');
    } catch (error) {
        next(error);
    }    
});

const catchAll = router.all('*', async (req, res) => {
    res.status(404).send('404 not found');
});

router.use('/', entry);
router.use('/', catchAll);



module.exports = router;
