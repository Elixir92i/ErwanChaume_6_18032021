// Importation du module express 
const express = require('express');
// Importation du module router
const router = express.Router();

// Importation du password validator
const checkPassword = require('../middleware/checkPassword')

// Importation du controller user
const userCtrl = require('../controllers/user');

// Route création d'un utilisateur
router.post('/signup', checkPassword, userCtrl.signup);
// Route connexion d'un utilisateur
router.post('/login', userCtrl.login);

module.exports = router;