const express = require('express');
const router = express.Router();
const controller = require('../../controller/Controller');

router.get('/view', async (req, res, next) => {
    const nrOfApplications = req.query.nrApps;
    try {
        const applications = await controller.get_applications(nrOfApplications);
        res.send(applications);
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;