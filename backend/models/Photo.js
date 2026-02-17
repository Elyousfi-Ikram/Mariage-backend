const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
  path: { type: String, required: true }, // nom de fichier sur le disque
  url: { type: String, required: true },  // URL publique servie via /images
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
});

module.exports = mongoose.model('Photo', PhotoSchema);

