const Sequelize = require("sequelize");
const sequelize = require("../integration/dbconfig");

const Person = sequelize.define("persons", {
        person_id: {
            type: Sequelize.INTEGER,
            
            primaryKey: true,
            autoIncrement: true
           
        },
        name: {
            type: Sequelize.STRING,
          
            
        },
        surname: {
            type: Sequelize.STRING,
           
           
        },
        pnr: {
            type: Sequelize.STRING,
           
           
        },
        email: {
            type: Sequelize.STRING,
           
           
        },
        external_person_id: {
            type: Sequelize.INTEGER,
           
           
        }
});

module.exports = Person