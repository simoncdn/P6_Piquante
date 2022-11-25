const validator = require("validator");

module.exports = function(req, res, next){

    const email = req.body.email;

    if(validator.isEmail(req.body.email)){
        console.log(`email valide ${email}`);
        next()
    }
    else{
        console.log("Email non valide");
        return res.status(400).json({error : `l'email ${email} n'est pas valide`})

    }
};
