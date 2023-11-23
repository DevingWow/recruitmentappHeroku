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
}