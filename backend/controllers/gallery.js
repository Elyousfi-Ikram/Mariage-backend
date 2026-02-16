const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const IMAGES_DIR = path.join(__dirname, '../uploads');

exports.getPhotos = (req, res) => {
  fs.readdir(IMAGES_DIR, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT') return res.status(200).json([]);
      return res.status(500).json({ message: 'Error reading images directory' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}/images`;
    const urls = files.map((f) => `${baseUrl}/${f}`);
    res.status(200).json(urls);
  });
};

exports.uploadPhotos = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const baseUrl = `${req.protocol}://${req.get('host')}/images`;
  const uploaded = req.files.map((f) => `${baseUrl}/${f.filename}`);
  res.status(201).json({ message: 'Files uploaded successfully', uploaded });
};

exports.deletePhoto = (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(IMAGES_DIR, filename);

  fs.unlink(filepath, (err) => {
    if (err) {
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
