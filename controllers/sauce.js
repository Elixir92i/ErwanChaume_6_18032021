// Importation du modèle des sauces
const Sauce = require('../models/Sauce');
// Importation du module fs 
const fs = require('fs');

// Créer une sauce
exports.createSauce = (req, res, next) => {
    // Récupération des informations du formulaire de création de sauce
    const sauceObject = JSON.parse(req.body.sauce);
    // Ajout des valeurs like et dislike par défaut = 0
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    // Suppression de l'ID car généré automatiquement par MongoDB
    delete sauceObject_id;
    // Création dans la base de donnée de la sauce avec l'image associée au sauceObject
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
    // Suppression de l'ancienne image si elle est modifiée
    var file = req.file;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Suppression de l'image associée dans la base de donnée avant modification
            const filename = sauce.imageUrl.split('/images/')[1];
            if (file && filename != file.filename) {
                fs.unlink(`images/${filename}`, () => {
                });
            }
        });
    // Recherche de l'image associée
    const sauceObject = req.file ?
        {
            // Récupération des informations de la sauce sélectionnée
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

    // Mise à jour de la sauce
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    // Recherche de la sauce grâce à son ID
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Suppression de l'image associée dans la base de donnée
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Suppression de la sauce dans la base de donnée
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Affichage de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Like et dislike d'une sauce
exports.likeSauce = (req, res, next) => {
    // Ajout des constantes necessaires
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    // Recherche de la sauce sélectionnée
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            // Ajout des variables pour récupérer les infos dans la base de donnée
            let usersLiked = sauce.usersLiked;
            let likes = sauce.likes;
            let usersDisliked = sauce.usersDisliked;
            let dislikes = sauce.dislikes;

            // L'utilisateur like la sauce
            if (like == 1) {
                // Vérification que l'utilisateur n'a pas déjà like la sauce
                if (!usersLiked.includes(userId)) {
                    // Si il n'a pas déjà like la sauce, push de son ID pour l'ajouter à la base de donnée
                    usersLiked.push(userId);
                    // Ajout de son like au compteur
                    likes++;
                }
                // L'utilisateur dislike la sauce
            } else if (like == -1) {
                // Vérification que l'utilisateur n'a pas déjà dislike la sauce
                if (!usersDisliked.includes(userId)) {
                    // Si il n'a pas déjà dislike la sauce, push de son ID pour l'ajouter à la base de donnée
                    usersDisliked.push(userId);
                    // Ajout de son dislike au compteur
                    dislikes++;
                }
                // L'utilisateur retire son like ou son dislike de la sauce
            } else if (like == 0) {
                // L'utilisateur retire son like de la sauce
                if (usersLiked.includes(userId)) {
                    // Recherche de l'ID de l'utilisateur dans le tableau des likes (userLiked)
                    var index = usersLiked.indexOf(userId);
                    // Suppression de son ID du tableau des likes (userLiked)
                    usersLiked.splice(index, 1);
                    // Retrait de son like au compteur
                    likes--;
                }
                // L'utilisateur retire son dislike de la sauce
                if (usersDisliked.includes(userId)) {
                    // Recherche de l'ID de l'utilisateur dans le tableau des dislikes (userDisliked)
                    var index = usersDisliked.indexOf(userId);
                    // Suppression de son ID du tableau des dislikes (userDisliked)
                    usersDisliked.splice(index, 1);
                    // Retrait de son dislike au compteur
                    dislikes--;
                }
            }
            // Mise à jour des champs nécessaires pour les likes et dislike
            Sauce.updateOne({ _id: sauceId },
                { dislikes: dislikes, usersDisliked: usersDisliked, likes: likes, usersLiked: usersLiked }
            )
                .then(() => res.status(200).json({ message: "L'utilisateur a mis un like ! " }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

}