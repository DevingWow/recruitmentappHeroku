const Sequelize = require("sequelize");
const sequelize = require("../integration/dbconfig");

const Role = sequelize.define("role", {
    role_id: {
        type: Sequelize.INTEGER,
            
            primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
          
    },
});

module.exports = Role