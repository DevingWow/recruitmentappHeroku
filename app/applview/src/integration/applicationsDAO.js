/*
In the findApplications method, we added an error handling for when no person is found in the database
*/ 


const Person = require('../model/Person')
const Competence = require('../model/Competence');
const Competence_profile = require('../model/Competence_profile');
const Availability = require('../model/Availability');
const Applicationstatus = require('../model/Applicationstatus');

const sequelize = require('../integration/dbconfig');
const { ApplicationDTO, ProfileDTO, AvailabilityDTO, competenceDTO } = require('../model/DTO');
const Transactor = require('./Transactor');
const logger = require('../util/Logger');

Person.hasMany(Availability, {foreignKey: 'person_id'});
Availability.belongsTo(Person, {foreignKey: 'person_id'});
Person.hasMany(Competence_profile, {foreignKey: 'person_id'});
Competence_profile.belongsTo(Person, {foreignKey: 'person_id'});
Competence.hasMany(Competence_profile, {foreignKey: 'competence_id'});
Competence_profile.belongsTo(Competence, {foreignKey: 'competence_id'});
Person.hasMany(Applicationstatus, {foreignKey: 'person_id'});
Applicationstatus.belongsTo(Person, {foreignKey: 'person_id'});


class ApplicationDAO {
    async findApplications(nrOfApplications) {
        try {       
            const applications = await Person.findAll({
                limit: nrOfApplications,
                attributes: ['name', 'surname', 'pnr', 'email'], // Selecting specific fields from the Person model
                include: [
                    {
                        model: Availability,
                        attributes: ['from_date', 'to_date'] // Selecting specific fields from the Availability model
                    },
                    {
                        model: Competence_profile,
                        attributes: ['years_of_experience'], // Selecting specific fields from the CompetenceProfile model
                        include: [
                            {
                                model: Competence,
                                attributes: ['name'] // Selecting specific fields from the Competency model
                            }
                        ]
                    }
                ]
            });
            return applications;           
        } catch (error){
            this.#logError(error);
            throw error;
        }
    }

    #logError(error){
        logger.log("[LOGGER]: "+error.stacktrace);
    }

    async findApplicationByPNR(pnr) {  
        try {
            const foundPerson = await Person.findOne({
                where: {
                    pnr: pnr
                }
            });
            const application = await this.findApplicationByPersonID(foundPerson.person_id);
            return application
        } catch (error) {
            this.#logError(error);
            throw error;
        }
    }

 
    async updateApplication(application, person_id) {
        const transactor = new Transactor();
        try {
            await transactor.startTransaction();
            const person = await Person.findOne({
                where: {
                    person_id: person_id
                }
            });
            const availabilities = await Availability.findAll({
                where: {
                    person_id: person_id
                }
            });
            const competencies = await Competence_profile.findAll({
                where: {
                    person_id: person_id
                }
            });
            const allCompetencies = await Competence.findAll();
            const compMap = allCompetencies.reduce((map, e) => {
                map[e.competence_id] = e.name;
                return map;
            })
            const filteredAvailabilities = application.availabilities.filter(availability => {
                return !availabilities.some(existingAvailability => {
                    return availability.from_date === existingAvailability.from_date && availability.to_date === existingAvailability.to_date;
                });
            });
            const filteredCompetencies = application.competence_profiles.filter(competency => {
                const foundInAllCompetencies = allCompetencies.some(allCompetency => {
                    return competency.competency.name === compMap[allCompetency.competence_id];
                });
                const foundInExistingCompetencies = competencies.some(existingCompetency => {
                    return competency.competency.name === compMap[existingCompetency.competence_id];
                });

                return foundInAllCompetencies && !foundInExistingCompetencies;
            });
            for (const availability of filteredAvailabilities) {
                await Availability.create({
                    person_id: person_id,
                    from_date: availability.from_date,
                    to_date: availability.to_date
                });
            }
            for (const competency of filteredCompetencies) {
                const competence = await Competence.findOne({
                    where: {
                        name: competency.competency.name
                    }
                });
                await Competence_profile.create({
                    person_id: person_id,
                    competence_id: competence.competence_id,
                    years_of_experience: competency.years_of_experience
                });
            }
            await transactor.commit();
        } catch (error) {
            this.#logError(error);
            await transactor.rollback();
            throw error;
        }
    }

    async insertNewApplication(application, external_person_id) {
        const transactor = new Transactor();
        try {
            await transactor.startTransaction();
            const person = await Person.create({
                name: application.name,
                surname: application.surname,
                pnr: application.pnr,
                email: application.email,
                external_person_id: external_person_id
            });
            for (const availability of application.availabilities) {
                await Availability.create({
                    person_id: person.person_id,
                    from_date: availability.from_date,
                    to_date: availability.to_date
                });
            }
            for (const competence_profile of application.competence_profiles) {
                const competence = await Competence.findOne({
                    where: {
                        name: competence_profile.competency.name
                    }
                });
                await Competence_profile.create({
                    person_id: person.person_id,
                    competence_id: competence.competence_id,
                    years_of_experience: competence_profile.years_of_experience
                });
            }
            await transactor.commit();
        } catch (error) {
            await transactor.rollback();
            throw error;
        }
    }

    async findApplicationByIDS(id_type, id) {
        try {
            const application = await Person.findOne({
                where: {
                    [id_type]: id
                },
                attributes: ['person_id','name', 'surname', 'pnr', 'email'], // Selecting specific fields from the Person model
                include: [
                    {
                        model: Availability,
                        attributes: ['from_date', 'to_date'] // Selecting specific fields from the Availability model
                    },
                    {
                        model: Competence_profile,
                        attributes: ['years_of_experience'], // Selecting specific fields from the CompetenceProfile model
                        include: [
                            {
                                model: Competence,
                                attributes: ['name'] // Selecting specific fields from the Competency model
                            }
                        ]
                    }, 
                    {
                        model: Applicationstatus,
                        attributes: ['app_status'] // Selecting specific fields from the Applicationstatus model
                    }
                ]
            });
            return application;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findApplicationByPersonID(person_id) {
        try {
            return await this.findApplicationByIDS('person_id', person_id);
        } catch (error) {
            throw error;
        }
    }

    async findApplicationByExternalID(external_person_id) {
        try {
            return await this.findApplicationByIDS('external_person_id', external_person_id);
        } catch (error) {
            throw error;
        }
    }

    async getCompetencies () {
        try {
            const result = await Competence.findAll();
            const DTOs = result.map(e => new competenceDTO(e.competence_id, e.name))
            return DTOs;
        } catch (error) {
            throw error;
        }
    }

    async availabilitesByPersonId (person_id){
        try {
            const availabilites = await Availability.findAll({
                where: {
                    person_id: person_id
                }
            })
            const DTOs = availabilites.map(e => new AvailabilityDTO(e.availability_id,
                e.person_id, e.from_date, e.to_date))
            return DTOs;
        } catch (error) {
            throw error;
        }
    }

    async competencyByPersonId (person_id){
        try {
            const result = await Competence_profile.findAll({
                where: {
                    person_id: person_id
                }
            })
            const DTOs = result.map(e => new ProfileDTO(e.competence_profile_id,
                e.person_id, e.competence_id, e.years_of_experience));
            return DTOs;
        } catch (error) {
            throw error;
        }
    }

    async insertAvailability (person_id, from_date, to_date){
        try {
            const avail = await Availability.create({
                person_id: person_id,
                from_date: from_date,
                to_date: to_date,
            });
        } catch (error) {
            throw error;
        }
    }

    async insertCompetency (person_id, competence_id, years_of_experience){
        try {
            const comp = await Competence_profile.create({
                person_id: person_id,
                competence_id: competence_id,
                years_of_experience: years_of_experience,
            })
        } catch (error) {
            throw error;
        }
    }

    // NOT USED, NEEDS TO BE UPDATED
    createApplicationDTO(personModel, competence_profile_model, availabilitiesArr) {
        const availabilityModel = availabilitiesArr.map(e => {
            return {from_date: e.from_date, to_date: e.to_date};
        });
        return new ApplicationDTO(
            personModel.name +" " +personModel.surname,
            personModel.pnr,
            personModel.email,
            competence_profile_model,
            availabilityModel
        );
    }
}

module.exports = ApplicationDAO; 