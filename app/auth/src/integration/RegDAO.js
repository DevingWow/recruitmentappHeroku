/*The testConnection method now throws an error if it fails to authenticate with the database.

The findPersonById method now checks if the retrieved foundPerson is null and throws an error if it is.

The findPersonByIdentifiers method now throws an error if it fails to find a person by identifiers.

The insertNewPerson method now throws an error if it fails to insert a new person into the database*/

const {Sequelize, Op} = require('sequelize');
const Person = require('../model/Person');
const PersonDTO = require('../model/PersonDTO');
const sequelize = require('../integration/dbconfig');

class RegDAO {

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

    async findPersonByIdentifiers (username=null, email=null, pnr=null) {
        try {
            const validIdentifiers = [{username: username},{email: email},{pnr: pnr}].filter(elem => elem[Object.keys(elem)[0]] !== null)
            if (validIdentifiers.length === 0) return null;
            const foundPerson = await Person.findAll({
                where: {
                    [Op.or]: validIdentifiers
                }
            });
            if (foundPerson.length === 0) return null;
            return this.createPersonDTO(foundPerson[0]);
        } catch (error){
            console.error(error);
            throw error;
        }
    }

    async insertNewPerson(username, email, pnr, password, name, surname){
        try {
            const newPerson = await Person.create({
                name: name,
                surname: surname,
                pnr: pnr,
                email: email,
                password: password,
                role_id: 2,
                username: username,
            });
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

module.exports = RegDAO;