const express = require('express');
const router = express.Router();
const controller = require('../../controller/Controller');

router.get('/viewMultiple', async (req, res, next) => {
    const nrOfApplications = req.query.nrApps;
    try {
        const applications = await controller.get_applications(nrOfApplications);
        res.send(applications);
    } catch (error) {
        console.log(error);
    }
});

router.get('/view', async (req, res, next) => {
    const pnr = req.query.personal_number;
    try {
        const application = await controller.get_applicationByPNR(pnr);
        res.send(application);
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;