const express = require('express');
const router = express.Router();
const albumsController = require('../controllers/albums');
const auth = require('../middleware/auth');

router.get('/mine', auth, albumsController.mine);
router.post('/', auth, albumsController.create);
router.delete('/:id', auth, albumsController.remove);
router.post('/:id/share/ensure', auth, albumsController.ensureShareLink);
router.post('/:id/share/track', auth, albumsController.trackShare);

module.exports = router;
