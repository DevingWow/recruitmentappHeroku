const jwt = require('jsonwebtoken');


const decryptToken = (token) => {
    if (!token) return null;
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    if(jwtPayload?.person_id){
        return {person_id: jwtPayload.person_id};
    }
    return null;
}

module.exports = decryptToken;