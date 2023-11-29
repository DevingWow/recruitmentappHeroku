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
router.use('/', entry);

module.exports = router;