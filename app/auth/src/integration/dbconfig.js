const Sequelize = require('sequelize');
require('dotenv').config();
const logger = require('../util/Logger');

// Generated sequalize instance depends on if we are on production
// or a dev runtime.
function init_db(){
    try {
        return process.env.DATABASE_URL? 
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
    } catch (error) {
        logger.log("[DB ERROR] " + error);
    }
}

const db = init_db();
module.exports = db;