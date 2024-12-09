const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');

router.post('/', auth, roomController.createRoom);
router.get('/', auth, roomController.getRooms);
router.post('/:roomId/join', auth, roomController.joinRoom);
router.delete('/:roomId', auth, roomController.deleteRoom);

module.exports = router; 