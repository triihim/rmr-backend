const noSpaces = (str) => str && str.indexOf(" ") === -1;

function validateEmail(email) {
    return noSpaces(email) && /^\w+@\w+\.[a-z]{2,3}$/.test(email);
}

function validatePassword(password) {
    return (password && 
            password.length >= 8 &&
            password.length <= 16 &&
            noSpaces(password)) ? true : false;
}

module.exports.validateEmail = validateEmail;
module.exports.validatePassword = validatePassword;