const mongoose = require('mongoose'); 
// Module de mongoose permettant de vérifier si l'utilisateur n'existe pas déjà dans la base de donnée
const uniqueValidator = require('mongoose-unique-validator');

// Mise en place du schéma de création d'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);