// Importation du module multer pour les photos
const multer = require('multer'); 

// Extensions des images acceptées par multer
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Image à stocker
const storage = multer.diskStorage({
    // Dossier de destination
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Modification du nom des images reçu lors de l'ajout d'une sauce
    filename: (req, file, cb) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        cb(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');