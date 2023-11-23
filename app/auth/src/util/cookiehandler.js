const jwt = require('jsonwebtoken')

/**
 * Sends an authorization jwt token as cookie to the client
 * Use this on successfull client login
 * @param {*} user the user that logged in
 * @param {*} res the response object 
 */
const sendAuthCookie = async (user, res) => {
    console.log(user)
    const token = jwt.sign({person_id: user.person_id},
         process.env.JWT_SECRET, 
         {expiresIn: '30 minutes'});
    res.cookie('auth', token, {
        httpOnly: true,
        expires: 0
    })
}

/**
 * Check client authorization using JWT token in client cookie.
 * @param {*} contr controller to check database if client is logged in or not, to be implemented
 * @param {*} req request object
 * @param {*} res response object
 * @returns 
 */
const checkAuth = async (contr, req, res) => {
    const cookie = req.cookies.auth;
    if (!cookie){
        return null;
    }
    try {
        const jwtUserPayload = jwt.verify(cookie, process.env.JWT_SECRET);
        console.log(jwtUserPayload);
        //Implement function which calls controller for a database check for user if user is logged
        const userLoggedIn = await contr.getUserById(jwtUserPayload.person_id); // until above is implemented we assume user not logged in 
        console.log(userLoggedIn);
        if (!userLoggedIn){
            res.clearCookie('auth');
            return null;
        }
        return userLoggedIn;
    } catch (error) {
        //if verification or controller call failed
        res.clearCookie('auth');
        console.log(error)
        return null;
    }
}

const clearAuth = async (req, res) => {
    try {
        if (req.cookies.auth){
            res.clearCookie('auth');
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}

module.exports = {sendAuthCookie, checkAuth, clearAuth}