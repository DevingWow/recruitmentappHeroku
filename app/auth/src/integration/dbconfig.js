const Sequelize = require('sequelize');
require('dotenv').config();

// Generated sequalize instance depends on if we are on production
// or a dev runtime.
module.exports = process.env.DATABASE_URL? 
new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    operatorAliases: false,
    define: {
        timestamps: false
    }
}):new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST||'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT||5432,
    operatorAliases: false,
    define: {
        timestamps: false
      },

    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});