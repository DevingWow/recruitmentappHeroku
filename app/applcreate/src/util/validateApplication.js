const Exception = require("./Exception");

function isAlphabetic (str) {
    const regex = /^[a-zA-Z]*$/;
    return regex.test(str);
}

function isPositiveFloat (str) {
    const regex = /^\d+(\.\d+)?$/;
    return regex.test(str);
}

function isValidEmailFormat (emailStr) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // ai generated regex
    return regex.test(emailStr);
}

function checkDateFormat(date){
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date) && !isNaN(Date.parse(date));
}
    

function isValidPnrFormat (pnrStr) {
    const regex = /^\d{8}-\d{4}$/;
    return regex.test(pnrStr);
}

function isEqualOrLarger(str, size){
    return str.length >= size;
}

function isValidPersonDTO(person){
    const MIN_NAME_SURNAME_LEN = 2;
    return isEqualOrLarger(person.name, MIN_NAME_SURNAME_LEN) 
    && isEqualOrLarger(person.surname, MIN_NAME_SURNAME_LEN)
    && isValidPnrFormat(person.pnr)
    && isValidEmailFormat(person.email)
    && isAlphabetic(person.name)
    && isAlphabetic(person.surname);
}

function isValidAvailabilityDTO(av){
    return checkDateFormat(av.from_date) 
    && checkDateFormat(av.to_date)
    && av.from_date <= av.to_date;
}

function isValidCompetenceProfileDTO(cp){
    return isPositiveFloat(cp.years_of_experience)
    && typeof cp.competency?.name === 'string';
}

function validateApplication(app){
    try {
        return app?.person
        && isValidPersonDTO(app.person)
        && app?.availabilities.every(av => isValidAvailabilityDTO(av))
        && app?.competence_profiles.every(cp => isValidCompetenceProfileDTO(cp))
        && true || false;
    } catch (error) {
        throw new Exception(error.message, "Invalid application", 400);
    }
}

module.exports = validateApplication;