const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery');
const upload = require('../config/multer');

router.get('/photos', galleryController.getPhotos);
router.post('/upload', upload.array('photos'), galleryController.uploadPhotos);
router.delete('/photos/:filename', galleryController.deletePhoto);
router.get('/download-all', galleryController.downloadAll);
router.post('/download-selected', galleryController.downloadSelected);

module.exports = router;
