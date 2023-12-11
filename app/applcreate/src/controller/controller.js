const { PersonDTO , Competence_profileDTO, ApplicationDTO, CompetencyDTO, AvailabilityDTO} = require('../model/models');
const mqInstance = require('../mq/MessageBroker');
const Exception = require('../util/Exception');
const validateApplication = require('../util/validateApplication');

class Controller {
    constructor() {
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
            const wrappedApplication = {token:token, application: application};
            const confirmation =  await mqInstance.sendMessage(JSON.stringify(wrappedApplication));
            if(confirmation.status !== 'OK'){
                throw new Exception("Could not send application",500);
            }
            return "application created";
        } catch (error) {
            throw error;
        }
    }
}

const controller = new Controller();
Object.freeze(controller);

module.exports = controller;