// Importation du module express
const express = require('express');
// Importation du module router
const router = express.Router();

// Importation des middleware et du controller de sauce 
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route création d'une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
// Route modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Route suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// Route affichage d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Route affichage des sauces
router.get('/', auth, sauceCtrl.getAllSauce);
// Route like d'une sauce (et dislike)
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;