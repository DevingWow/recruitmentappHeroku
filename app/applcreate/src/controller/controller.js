const redisAO = require("../redis/redisAO");
const { PersonDTO , Competence_profileDTO, ApplicationDTO, CompetencyDTO, AvailabilityDTO} = require('../model/models');
const Exception = require('../util/Exception');
const validateApplication = require('../util/validateApplication');

class Controller {
    constructor() {
        this.redisAOinstance = new redisAO();
        this.redisAOinstance.init();
    }

    async createApplication(application, token, maxWait){
        try {
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

            await this.redisAOinstance.publishPayload(application, token);
            const status = await this.redisAOinstance.waitConfirmation(token, maxWait);
            if(status === 'OK'){
                return "Application created";
            } else if(status === 'pending') {
                throw new Exception('Application creation timed out after ' + MAX_WAIT_TIME + 'ms', 'Application might not have been saved, try again' , 408);
            } else {
                throw new Exception('Application creation failed', 'Application creation failed , 500');
            }
        } catch (error) {
            throw error;
        }
    }
}

const controller = new Controller();
Object.freeze(controller);

module.exports = controller;