const Room = require('../models/Room');
const Message = require('../models/Message');

const roomController = {
  // Create a new room
  createRoom: async (req, res) => {
    try {
      const { name, description, type } = req.body;
      const room = new Room({
        name,
        description,
        type,
        creator: req.user._id,
        members: [req.user._id]
      });

      await room.save();
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all rooms
  getRooms: async (req, res) => {
    try {
      const rooms = await Room.find({ type: 'public' })
        .populate('creator', 'username')
        .populate('members', 'username')
        .sort({ createdAt: -1 });
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Join a room
  joinRoom: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      if (!room.members.includes(req.user._id)) {
        room.members.push(req.user._id);
        await room.save();
      }

      // Notify room members through socket
      req.app.get('io').to(roomId).emit('userJoined', {
        user: req.user.username,
        roomId: room._id
      });

      res.json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a room
  deleteRoom: async (req, res) => {
    try {
      const { roomId } = req.params;
      console.log('Attempting to delete room:', roomId);
      console.log('User ID:', req.user._id);
      
      const room = await Room.findById(roomId);
      if (!room) {
        console.log('Room not found');
        return res.status(404).json({ error: 'Room not found' });
      }

      console.log('Room creator:', room.creator);
      // Check if user is the creator of the room
      if (room.creator.toString() !== req.user._id.toString()) {
        console.log('User not authorized to delete room');
        return res.status(403).json({ error: 'Not authorized to delete this room' });
      }

      await Room.findByIdAndDelete(roomId);
      // Also delete all messages in this room
      await Message.deleteMany({ room: roomId });
      console.log('Room and messages deleted successfully');

      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = roomController; 