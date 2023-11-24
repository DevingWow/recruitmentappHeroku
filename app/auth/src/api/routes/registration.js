const express = require('express');
const router = express.Router();
const controller = require('../../controller/Controller');
const validator= require('../../util/Validator');

router.post("/", async (req, res, next) => { 
    try {
        const body = req.body;
        const validitystatus = validator.validateRegisterForm(
            body.username,
            body.password,
            body.pnr,
            body.email,
            body.name,
            body.surname
        );

        if (validitystatus > 0){
            res.send({register_status: 'fail', user: body.username, causes: validitystatus.map(cause => cause.msg)});
            return;
        }

        await controller.registerUser(
            body.username,
            body.password,
            body.pnr,
            body.email,
            body.name,
            body.surname
        );
        res.send({register_status: 'success', user: body.username});
    } catch (error) {
        next(error);
    }
});

module.exports = router;