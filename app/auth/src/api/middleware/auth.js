const authModule = require('../../util/cookiehandler')
const controller = require('../../controller/Controller');

console.log(authModule);
console.log(controller);
// check if the client who request is comming from is logged in
// if user is logged in it sets req.auth to true else false
// It is important this middleware is used before any routers!
const authCheck = async (req, res, next) => {
    try {
        const user = await authModule.checkAuth(controller, req, res);
        if (!user){
            //user not logged in
            req.auth = null;
        } else {
            //user is logged in 
            req.auth = user;
        }
    } catch (error) {
        next(error);
    }
    next();
}

module.exports = authCheck;