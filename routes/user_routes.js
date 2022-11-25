const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user_controller');
const userEmailCtrl = require("../middleware/controle_email");
const userPasswordCtrl = require("../middleware/controle_password");

router.post('/signup', userPasswordCtrl, userEmailCtrl, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;