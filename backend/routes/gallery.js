const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery');
const upload = require('../config/multer');
const auth = require('../middleware/auth');

router.get('/photos', auth, galleryController.getPhotos);
router.post('/upload', auth, upload.array('photos'), galleryController.uploadPhotos);
router.delete('/photos/:filename', auth, galleryController.deletePhoto);
router.get('/download-all', auth, galleryController.downloadAll);
router.post('/download-selected', auth, galleryController.downloadSelected);

module.exports = router;
