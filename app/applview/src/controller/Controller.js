const ApplicationDAO = require('../integration/applicationsDAO');
const Transactor = require('../integration/Transactor');

class Controller {
    constructor(){
        this.appDAO = new ApplicationDAO();
    }

    async updateApplication(person_id, availabilities, competencies) {
        const status = { success: false, msg: 'failed to update application' };

        if (availabilities.length === 0 && competencies.length === 0) {
            return status;
        }

        const transactor = new Transactor();

        try {
            await transactor.startTransaction();

            const existingAvailabilities = await this.appDAO.availabilitiesByPersonId(person_id);
            const existingCompetencies = await this.appDAO.competencyByPersonId(person_id);
            const allCompetencies = await this.get_competencies();

            const filteredAvailabilities = availabilities.filter(availability => {
                return !existingAvailabilities.some(existingAvailability => {
                    return availability.from === existingAvailability.from_date && availability.to === existingAvailability.to_date;
                });
            });

            const filteredCompetencies = competencies.filter(competency => {
                const foundInAllCompetencies = allCompetencies.some(allCompetency => {
                    return parseInt(competency.competency.id) === allCompetency.id;
                });

                const foundInExistingCompetencies = existingCompetencies.some(existingCompetency => {
                    return parseInt(competency.competency.id) === existingCompetency.competence_id;
                });

                return foundInAllCompetencies && !foundInExistingCompetencies;
            });

            for (const availability of filteredAvailabilities) {
                await this.appDAO.insertAvailability(person_id, availability.from, availability.to);
            }

            for (const competency of filteredCompetencies) {
                await this.appDAO.insertCompetency(person_id, competency.competency.id, competency.experience);
            }

            await transactor.commit();
            status.success = true;
            status.msg = 'application updated successfully';
        } catch (error) {
            await transactor.rollback();
            throw error;
        } finally {
            return status;
        }
    }

    async get_applicationByPNR (pnr){
        try {
            return await this.appDAO.findApplicationByPNR(pnr);
        } catch (error) {
            throw error;
        }
    }

    async get_applications (nrOfApplications){
        try {
            return await this.appDAO.findApplications(nrOfApplications);
        } catch (error) {
            throw error;
        }
    }
    

    async get_competencies (){
        try {
            return await this.appDAO.getCompetencies();
        } catch (error) {
            throw error;
        }
    }
}

const controller = new Controller();
Object.freeze(controller);

module.exports = controller;