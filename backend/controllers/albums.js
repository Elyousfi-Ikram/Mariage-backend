const Album = require('../models/Album');
const { v4: uuidv4 } = require('uuid');

exports.mine = async (req, res) => {
  try {
    const albums = await Album.find({ userId: req.user.userId });
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title } = req.body;
    const album = await Album.create({
      userId: req.user.userId,
      title,
      shareId: uuidv4(),
    });
    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Album.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.status(200).json({ message: 'Album deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.ensureShareLink = async (req, res) => {
  try {
    const album = await Album.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!album) return res.status(404).json({ message: 'Album not found' });

    if (!album.shareId) {
      album.shareId = uuidv4();
      await album.save();
    }
    
    // Construct the share link (pointing to frontend)
    // Assuming frontend handles /share/:shareId
    // We need to know the frontend URL. For now using referrer or origin.
    const frontendUrl = req.get('origin') || 'https://mariage-frontend-n8v9.vercel.app';
    const shareLink = `${frontendUrl}/share/${album.shareId}`;

    res.status(200).json({ shareId: album.shareId, shareLink });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackShare = async (req, res) => {
  // Logic to track share stats could go here
  res.status(200).json({ message: 'Tracked' });
};
