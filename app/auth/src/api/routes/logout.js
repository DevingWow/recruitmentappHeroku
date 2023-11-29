const express = require('express');
const router = express.Router();
const cookiehandler = require('../../util/cookiehandler');

router.get("/", async (req, res, next) => {
    try {
        if (req.auth){
            await cookiehandler.clearAuth(req, res);
        }
        res.send({login_status: 'logged out'}); 
    } catch (error) {
        next(error);
    }
});

module.exports = router;