
//MessageBroker interface
class MessageBroker {
    async connect() {}
    async sendMessage( message,timeoutafter) {}
    async receiveMessage(topic) {}   
    async ackMessage(msg) {}
    async nackMessage(msg) {}
    extractMessageContentString(msg){}
}



module.exports = MessageBroker;