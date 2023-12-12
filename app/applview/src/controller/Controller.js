const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');
require('dotenv').config({
    path: path.join(APP_ROOT_DIR, '.env')
});

const ApplicationDAO = require('../integration/applicationsDAO');
const decryptToken = require('../util/tokenHandler');
const logger = require('../util/Logger');
const MessageBrokerFactory = require('../mq/MessageBroker');
const initMQ = require('../mq/mqHandler');

class Controller {
    constructor(){
        this.appDAO = new ApplicationDAO();
        this.messageBroker = MessageBrokerFactory();
    }

    async initMessageBroker(){
        await initMQ(this.messageBroker, this.processMQdata.bind(this));
    }

    async processMQdata(data){
        try {
            const decToken = decryptToken(data.token);
            if (!decToken) throw new Error('Invalid token');
            const external_person_id = decToken.person_id;
            const application = data.application;
            console.log("APPLICATION: ", application, "PERSON ID: ", external_person_id);
            if(!application || !external_person_id) throw new Error('Invalid application or ext id');
            const foundByPersonID = await this.appDAO.findApplicationByExternalID(external_person_id);
            console.log("FOUND BY PERSON ID: ", foundByPersonID);
            if (!foundByPersonID){
                console.log("INSERTING NEW APPLICATION");
                 await this.appDAO.insertNewApplication(application, external_person_id);
            }
            else {
                console.log("UPDATING APPLICATION");
                await this.appDAO.updateApplication(application, foundByPersonID.person_id);
            }
            console.log("ACKING MESSAGE");
            return true;
        } catch (error) {
            throw error;
        }
    }

    async get_applicationByPNR (pnr){
        try {
            return await this.appDAO.findApplicationByPNR(pnr);
        } catch (error) {
            throw error;
        }
    }

    async get_applications (nrOfApplications){
        try {
            return await this.appDAO.findApplications(nrOfApplications);
        } catch (error) {
            throw error;
        }
    }
    

    async get_competencies (){
        try {
            return await this.appDAO.getCompetencies();
        } catch (error) {
            throw error;
        }
    }
}

const controller = new Controller();
Object.freeze(controller);

controller.initMessageBroker();

module.exports = controller;