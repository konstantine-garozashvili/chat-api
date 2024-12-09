const { createTestUser } = require('../helpers');
const { createSocketClient } = require('../helpers/socket');

describe('WebSocket Integration Tests', () => {
  let user1, user2, socket1, socket2;

  beforeAll(async () => {
    user1 = await createTestUser('user1');
    user2 = await createTestUser('user2');
  });

  beforeEach(() => {
    socket1 = createSocketClient(user1);
    socket2 = createSocketClient(user2);
  });

  afterEach(() => {
    socket1.close();
    socket2.close();
  });

  it('should connect and authenticate users', (done) => {
    socket1.on('connect', () => {
      expect(socket1.connected).toBe(true);
      done();
    });
  });

  it('should send and receive private messages', (done) => {
    const testMessage = 'Hello privately!';

    socket2.on('privateMessage', (message) => {
      expect(message.content).toBe(testMessage);
      expect(message.sender).toBe(user1._id.toString());
      done();
    });

    socket1.emit('privateMessage', {
      recipient: user2._id,
      content: testMessage
    });
  });
}); 