/*
We have error handling blocks with console.error statements to log the error details in case any errors occur during database operations. 
We have also await before the transaction.rollback() function calls to ensure that the rollback operation is completed before throwing the error.
*/ 
const Person = require('../model/Person');
const PersonDTO = require('../model/PersonDTO');
const sequelize = require("../integration/dbconfig");

class LoginDAO {
    async findUser(id) {

        const transaction = await sequelize.transaction();

        try {
            let foundUser = await Person.findAll({where : {username: id}})
            if(foundUser[0]){
                transaction.commit();
                return this.createPersonDTO(foundUser[0]);
            }
            foundUser = await Person.findAll({where : {pnr: id}})
            if(foundUser[0]) {
                transaction.commit();
                return this.createPersonDTO(foundUser[0])
            }
            transaction.commit();
            return null;                     
        } catch (error){
            await transaction.rollback();
            console.error('Error occurred while finding user: ', error);
            throw error;
        }
    }

    async hasPassword(user){
        if(user && user.password){
            return true;
        } else {
            return false;
        }
    }

    async findUserByEmail(email){
        const transaction = await sequelize.transaction();
        try {
            let foundUser = await Person.findAll({where : {email: email}})
            if(foundUser[0]){
                transaction.commit();
                return this.createPersonDTO(foundUser[0])
            } else {
                transaction.commit();
                return null
            }
        } catch(error){
            await transaction.rollback();
            console.error('Error occurred while finding user by email: ', error);
            throw error;

        }
       
    }

    async checkPassword(user, password){
        if(user && user.password == password){
            return user;          
         } else {
            return null;
         }
    }

    async setPassword(pnr, password){
        const transaction = await sequelize.transaction();
        try {
            const update = await Person.update({password: password}, {where: {pnr: pnr}})
            transaction.commit();
            return update;

        } catch(error){
            await transaction.rollback();
            console.error('Error occurred while setting password: ', error);
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

module.exports = LoginDAO