// passes test if alphanumeric characters or undersoce
function isAlphaNumericSlash (str) {
    const regex = /^[a-zA-Z0-9_]*$/;
    return regex.test(str);
}

function isAlphabetic (str) {
    const regex = /^[a-zA-Z]*$/;
    return regex.test(str);
}

function isValidEmailFormat (emailStr) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // ai generated regex
    return regex.test(emailStr);
}

function isValidPnrFormat (pnrStr) {
    const regex = /^\d{8}-\d{4}$/;
    return regex.test(pnrStr);
}

function isEqualOrLarger(str, size){
    return str.length >= size;
}

function validateRegisterForm (username, password, pnr, email, name, surname) {
    const status_gen = (bool, msg) => {return {status: bool, msg: msg}};

    const MIN_USERNAME_SIZE = 3;
    const MIN_PASSWORD_SIZE = 6;
    const MIN_NAME_LEN = 2;
    const MIN_SURNAME_LEN = 2;
    let checks = [status_gen(isAlphaNumericSlash(username) && isEqualOrLarger(username, MIN_USERNAME_SIZE),
    "username must be at least 3 character and alphanumeric")];
    checks = [...checks, status_gen(isAlphaNumericSlash(password) && isEqualOrLarger(password, MIN_PASSWORD_SIZE),
        "password must be at least 6 characters and alphanumeric with slash allowed")];
    checks = [...checks, status_gen(isValidPnrFormat(pnr), "person number must be of format: yymmdd-xxxx"),
     status_gen(isValidEmailFormat(email),"invalid email format")];
    checks = [...checks, status_gen(isAlphabetic(name) && isEqualOrLarger(name, MIN_NAME_LEN),"name must be at least 2 characters long and alphabatic")];
    checks = [...checks, status_gen(isAlphabetic(surname) && isEqualOrLarger(surname, MIN_SURNAME_LEN), "surname must be at least 2 characters long and alphabatic")];
    console.log(JSON.stringify(checks))
    const filtered = checks.filter(el => el.status === false);
    console.log(JSON.stringify(filtered))
    return filtered;
}

module.exports = {validateRegisterForm, isAlphaNumericSlash}