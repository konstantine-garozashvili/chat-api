const Message = require('./Message');
const User = require('./User');
const Room = require('./Room');
const Performance = require('./Performance');

async function createIndexes() {
  try {
    // Message indexes
    await Message.collection.createIndex({ room: 1, createdAt: -1 });
    await Message.collection.createIndex({ sender: 1 });
    await Message.collection.createIndex({ 'status.user': 1 });

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ 'apiKey.key': 1 }, { unique: true });

    // Room indexes
    await Room.collection.createIndex({ name: 1 });
    await Room.collection.createIndex({ members: 1 });
    await Room.collection.createIndex({ type: 1 });

    // Performance indexes
    await Performance.collection.createIndex({ timestamp: -1 });
    await Performance.collection.createIndex({ path: 1, method: 1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

module.exports = createIndexes; 