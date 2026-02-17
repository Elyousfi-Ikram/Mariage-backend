const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const syncController = require('../controllers/sync');

router.get('/snapshot', auth, syncController.snapshot);
router.get('/changes', auth, syncController.changes);

module.exports = router;

