const express = require('express');
const { PersonDTO , Competence_profileDTO, ApplicationDTO, CompetencyDTO, AvailabilityDTO} = require('../model/models');
const validateApplication = require('../util/validateApplication');
const Exception = require('../util/Exception');
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
        console.log(application);
        if(!application){
            throw new Exception("No application in request body", "No application data", 400);
        }
        const person = new PersonDTO(application.name, application.surname, application.pnr, application.email);
        const competence_profiles = application.competence_profiles.map(c => {
            return new Competence_profileDTO(c.years_of_experience, c.competency.name);
        });
        const availabilities = application.availabilities.map(a =>{
            return new AvailabilityDTO(a.from_date, a.to_date);
        });
        const appDTO = new ApplicationDTO(person, availabilities, competence_profiles);
        if(!validateApplication(appDTO)){
            throw new Exception("Invalid application",400);
        }
        res.send("Application created");
    } catch (error) {
        next(new Exception(error.message, "Failed to create application", 400));
    }
});

router.use('/', entry);
router.use('/', createApplication);

module.exports = router;