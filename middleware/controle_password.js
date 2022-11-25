var passwordValidator = require('password-validator');

var passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = function (req, res, next) {

    if (passwordSchema.validate(req.body.password)) {
        
        next();
    } else {
        console.log("Mot de passe pas assez fort !Le mot de passe doit contenir entre 8 et 20 caractères, avec au moins une majuscule et deux chiffre !")
        return res.status(400).json({message:"Le mot de passe doit contenir entre 8 et 20 caractères, avec au moins une majuscule et deux chiffre !"});
    }
};