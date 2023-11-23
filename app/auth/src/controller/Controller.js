const LoginDAO = require('../integration/LoginDAO')
const AuthDAO = require('../integration/AuthDAO');


class Controller {
    constructor () {
        this.loginDAO = new LoginDAO();
        this.authDAO = new AuthDAO();
    }

    async loginUser(username, password){
       const user = await this.loginDAO.findUser(username)
      
       if(await this.loginDAO.hasPassword(user)){
        console.log("In here!")
        return await this.loginDAO.checkPassword(user, password)
       } else {
        return user;
       }
    }

    async setPassword(personnumber, password) {
        this.loginDAO.setPassword(personnumber, password)
    }

    async findUserByEmail(email){
        return await this.loginDAO.findUserByEmail(email);
    }


    async getUserById (person_id){
        try {
            return await this.authDAO.findPersonById(person_id);
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