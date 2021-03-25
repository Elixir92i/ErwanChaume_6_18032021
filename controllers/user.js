// Importation du module bcrypt (cryptage du mot de passe)
const bcrypt = require('bcrypt');
// Importation du modèle de création d'utilisateur
const User = require('../models/User');
// Importation du module JWT (token unique par utilisateur)
const jwt = require('jsonwebtoken');

// Création d'un utilisateur
exports.signup = (req, res, next) => {
  // Hashage du mot de passe récupéré dans le formulaire d'inscription
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Création d'un nouvel utilisateur dans la base de donnée
      const user = new User({
        // Récupération de l'adresse mail écrite dans le formulaire d'inscription
        email: req.body.email,
        // Récupération du mot de passe hashé
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Connexion d'un utilisateur  
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur dans la base de donnée via son email
  User.findOne({ email: req.body.email })
    .then(user => {
      // Erreur si l'utilisateur n'est pas trouvé
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // Comparaison du mot de passe hashé si présent dans la base donnée
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Erreur si le mot de passe diffère
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // Si il correspond envoie du token utilisateur
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'Y_GnWYTBjvZj0f_7ShMfnw6vp47BUtEvxqcBsvRU3sA',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};