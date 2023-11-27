const LoginDAO = require('../integration/LoginDAO')
const AuthDAO = require('../integration/AuthDAO');
const regDAO = require('../integration/RegDAO');
const Transactor = require('../integration/Transactor');


class Controller {
    constructor () {
        this.loginDAO = new LoginDAO();
        this.authDAO = new AuthDAO();
        this.regDAO = new regDAO();
    }

    async loginUser(username, password){
        let user;
        try{
            user = await this.loginDAO.findUser(username)
        } catch (error) {
            throw error;
        }
        if(await this.loginDAO.hasPassword(user)){
            console.log("In here!")
            return await this.loginDAO.checkPassword(user, password)
        } else {
        
        }
    }

    async setPassword(personnumber, password) {
        try {
            this.loginDAO.setPassword(personnumber, password)
        } catch (error) {
            throw error;            
        }
    }

    async findUserByEmail(email){
        try {
            return await this.loginDAO.findUserByEmail(email);
        } catch (error) {
            throw error;
        }
    }


    async getUserById (person_id){
        try {
            return await this.authDAO.findPersonById(person_id);
        } catch (error) {
            throw error;
        }
    }


    async registerUser (username, password, pnr, email, name, surname){
        const transactor = new Transactor(); // creating transactor interface
        
        try {   
            await transactor.startTransaction();  // start transaction
            try {
                const res = await this.regDAO.findPersonByIdentifiers(username, email, pnr);
                if (res !== null) {
                    await transactor.commit(); // commit if user already exists and return
                    return false;
                }
                await this.regDAO.insertNewPerson(username, email, pnr, password, name, surname)  
                transactor.commit(); // commit inserted user
            } catch (error) {
                transactor.rollback(); // rollback if transaction fails
                throw error; // throwing error so it propagates up to error handlers.
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
}

// Creating a controller singleton and freezing the object 
// to not allow changes to its properties.
const controller = new Controller();
Object.freeze(controller);

// exporting singleton instance, not class
module.exports = controller;