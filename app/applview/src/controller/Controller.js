const ApplicationDAO = require('../integration/applicationsDAO');
const Transactor = require('../integration/Transactor');

class Controller {
    constructor(){
        this.appDAO = new ApplicationDAO();
    }

    async updateApplication (person_id, availablities, competencies){
        let status = {success: false, msg: 'failed to update application'}
        if (availablities.length === 0 && competencies.length === 0) return status;
        const transactor = new Transactor();
        try {
            await transactor.startTransaction();
            const existing_av = await this.appDAO.availabilitesByPersonId(person_id);
            const existing_comp = await this.appDAO.competencyByPersonId(person_id); 
            const comps = await this.get_competencies();

            availablities = availablities.filter(e => {
                let found = existing_av.find(x => {
                    return (e.from === x.from_date && e.to === x.to_date)
                })
                return found?false:true;
            })

            competencies = competencies.filter(e => {
                let found0 = comps.find(x =>{
                    return parseInt(e.competency.id) === x.id;
                })
                let found1 = existing_comp.find(x => {
                    return parseInt(e.competency.id) === x.competence_id
                })
                return (found0 !== undefined && found1 !== undefined)?false:true;
            })

            for(let i = 0; i < availablities.length; i++){
                let e = availablities[i];
                await this.appDAO.insertAvailability(person_id, e.from, e.to)
            }
            for(let i = 0; i < competencies.length; i++){
                let e = competencies[i];
                await this.appDAO.insertCompetency(person_id, e.competency.id, e.experience)
            }
            await transactor.commit();
            status.success = true;
            status.msg = 'application updated successfully'
        } catch (error) {
            await transactor.rollback();
            throw error;
        }
        finally {
            return status;
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