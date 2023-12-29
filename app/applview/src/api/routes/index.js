const express = require('express');
const router = express.Router();

const applicationsrouter = require('./applications');

const entry = router.get('/', async (req,res) => {
    try {
        res.send('welcome to applview micro!\n');
    } catch (error) {
        next(error);
    }    
});


router.use('/applications', applicationsrouter);
router.use('/applications', entry);

const catchAll = router.all('*', async (req, res) => {
    res.status(404).send('404 not found');
});

router.use('/', catchAll);

module.exports = router;