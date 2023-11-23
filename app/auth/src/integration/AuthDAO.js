const Person = require('../model/Person');
const PersonDTO = require('../model/PersonDTO');
const sequelize = require("../integration/dbconfig");

class AuthDAO {
    async findPersonById (person_id) {
        try {
            const foundPerson = await Person.findByPk(person_id);
            if (foundPerson.length === 0) return null;
            return this.createPersonDTO(foundPerson);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    createPersonDTO(personModel) {
        return new PersonDTO(
            personModel.person_id,
            personModel.name,
            personModel.surname,
            personModel.pnr,
            personModel.email,
            personModel.password,
            personModel.role_id,
            personModel.username
        );
    }
}

module.exports = AuthDAO;