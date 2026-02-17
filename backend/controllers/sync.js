const Album = require('../models/Album');
const Photo = require('../models/Photo');

exports.snapshot = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [albums, photos] = await Promise.all([
      Album.find({ userId }),
      Photo.find({ userId }),
    ]);
    res.status(200).json({
      albums,
      photos,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating snapshot', error: error.message });
  }
};

exports.changes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sinceRaw = req.query.since;
    if (!sinceRaw) {
      return res.status(400).json({ message: 'Missing since parameter' });
    }
    const since = new Date(sinceRaw);
    if (Number.isNaN(since.getTime())) {
      return res.status(400).json({ message: 'Invalid since parameter' });
    }

    const [albums, photos] = await Promise.all([
      Album.find({ userId, updatedAt: { $gt: since } }),
      Photo.find({ userId, updatedAt: { $gt: since } }),
    ]);

    res.status(200).json({
      albums,
      photos,
      since: sinceRaw,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching changes', error: error.message });
  }
};

