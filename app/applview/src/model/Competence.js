const Sequelize = require("sequelize");
const sequelize = require("../integration/dbconfig");

const Competence = sequelize.define("competencies", {
    competence_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,        
    },
    name: {
        type: Sequelize.STRING,
           
    },
});

module.exports = Competence