const express = require('express');
const Exception = require('../util/Exception');
const controller = require('../controller/controller');
const router = express.Router();

const entry = router.get('/', async (req, res, next) => {
    try {
        res.send("Hello from applcreate!");
    } catch (error) {
        next(error);
    }
});

const createApplication = router.post('/createApp', async (req, res, next) => {
    try {
        const application = req.body?.application;
        const token = req.cookies.auth;
        const MAX_WAIT_TIME = 5000;
        if(!token){
            throw new Exception("No auth token in request", "No auth token", 401);
        }
        if(!application){
            throw new Exception("No application in request body", "No application data", 400);
        } 
        const response = await controller.createApplication(application, token, MAX_WAIT_TIME);
        res.send(response);
    } catch (error) {
        next(new Exception(error.message, "Failed to create application", 400));
    }
});



router.use('/', entry);
router.use('/', createApplication);

const catchAll = router.all('*', async (req, res) => {
    res.status(404).send('404 not found');
});

router.use('/', catchAll);

module.exports = router;