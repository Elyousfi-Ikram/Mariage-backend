const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const Photo = require('../models/Photo');

const IMAGES_DIR = path.join(__dirname, '../uploads');

exports.getPhotos = async (req, res) => {
  try {
    const filter = { userId: req.user.userId };
    if (req.query.albumId) {
      filter.albumId = req.query.albumId;
    }
    const photos = await Photo.find(filter).sort({ createdAt: -1 });
    const urls = photos.map((p) => p.url);
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error: error.message });
  }
};

exports.uploadPhotos = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const baseUrl = `${req.protocol}://${req.get('host')}/images`;
  const { albumId } = req.body;
  try {
    const docs = await Photo.insertMany(
      req.files.map((file) => ({
        userId: req.user.userId,
        albumId: albumId || null,
        path: file.filename,
        url: `${baseUrl}/${file.filename}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      }))
    );
    const uploaded = docs.map((d) => d.url);
    res.status(201).json({ message: 'Files uploaded successfully', uploaded });
  } catch (error) {
    res.status(500).json({ message: 'Error saving photos', error: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(IMAGES_DIR, filename);

  try {
    await Photo.findOneAndDelete({ userId: req.user.userId, path: filename });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting photo metadata', error: error.message });
  }

  fs.unlink(filepath, (err) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ message: 'Error deleting file' });
    }
    res.status(200).json({ message: 'File deleted' });
  });
};

exports.downloadAll = (req, res) => {
  const archive = archiver('zip', { zlib: { level: 9 } });

  res.attachment('photos.zip');
  archive.pipe(res);

  archive.directory(IMAGES_DIR, false);
  archive.finalize();
};

exports.downloadSelected = (req, res) => {
  const { photos } = req.body; // Expecting array of filenames
  if (!photos || !Array.isArray(photos)) {
    return res.status(400).json({ message: 'No photos selected' });
  }

  const archive = archiver('zip', { zlib: { level: 9 } });

  res.attachment('selected_photos.zip');
  archive.pipe(res);

  photos.forEach((photo) => {
    const filepath = path.join(IMAGES_DIR, path.basename(photo));
    if (fs.existsSync(filepath)) {
      archive.file(filepath, { name: photo });
    }
  });

  archive.finalize();
};
