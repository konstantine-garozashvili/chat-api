class ChatWidget {
  constructor(config) {
    this.config = config;
    this.minimized = true;
    this.unreadCount = 0;
    this.init();
  }

  init() {
    this.createContainer();
    this.createToggleButton();
    this.createChatWindow();
    this.initializeSocket();
    this.setupEventListeners();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'chat-widget-container';
    document.body.appendChild(this.container);
  }

  createToggleButton() {
    this.toggleButton = document.createElement('button');
    this.toggleButton.id = 'chat-widget-toggle';
    this.toggleButton.innerHTML = `
      <span class="icon">💬</span>
      <span class="unread-count" style="display: none;">0</span>
    `;
    this.container.appendChild(this.toggleButton);
  }

  createChatWindow() {
    this.chatWindow = document.createElement('div');
    this.chatWindow.id = 'chat-widget-window';
    this.chatWindow.innerHTML = `
      <div class="chat-header">
        <h3>Chat Support</h3>
        <button class="minimize">−</button>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input">
        <textarea placeholder="Type a message..."></textarea>
        <button class="send">Send</button>
      </div>
    `;
    this.container.appendChild(this.chatWindow);
  }

  setupEventListeners() {
    // Toggle chat window
    this.toggleButton.addEventListener('click', () => this.toggleChat());

    // Send message
    const sendButton = this.chatWindow.querySelector('.send');
    const textarea = this.chatWindow.querySelector('textarea');
    
    sendButton.addEventListener('click', () => this.sendMessage());
    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Minimize button
    const minimizeButton = this.chatWindow.querySelector('.minimize');
    minimizeButton.addEventListener('click', () => this.toggleChat());
  }

  toggleChat() {
    this.minimized = !this.minimized;
    this.container.classList.toggle('minimized', this.minimized);
    if (!this.minimized) {
      this.unreadCount = 0;
      this.updateUnreadCount();
      this.chatWindow.querySelector('textarea').focus();
    }
  }

  async sendMessage() {
    const textarea = this.chatWindow.querySelector('textarea');
    const content = textarea.value.trim();
    
    if (!content) return;

    textarea.value = '';
    
    try {
      await this.socket.emit('message', {
        content,
        type: 'text'
      });

      this.addMessage({
        content,
        sender: 'user',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      this.showError('Failed to send message');
    }
  }

  addMessage(message) {
    const messagesContainer = this.chatWindow.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender}`;
    messageElement.innerHTML = `
      <div class="content">${message.content}</div>
      <div class="timestamp">${this.formatTime(message.timestamp)}</div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (this.minimized) {
      this.unreadCount++;
      this.updateUnreadCount();
    }
  }

  updateUnreadCount() {
    const unreadElement = this.toggleButton.querySelector('.unread-count');
    if (this.unreadCount > 0) {
      unreadElement.textContent = this.unreadCount;
      unreadElement.style.display = 'block';
    } else {
      unreadElement.style.display = 'none';
    }
  }

  formatTime(date) {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  showError(message) {
    const error = document.createElement('div');
    error.className = 'chat-error';
    error.textContent = message;
    this.chatWindow.appendChild(error);
    setTimeout(() => error.remove(), 3000);
  }

  initializeSocket() {
    this.socket = io(this.config.baseUrl, {
      auth: {
        apiKey: this.config.apiKey
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('message', (message) => {
      this.addMessage({
        content: message.content,
        sender: 'bot',
        timestamp: new Date(message.createdAt)
      });
    });

    this.socket.on('typing', (data) => {
      this.showTypingIndicator(data.username);
    });
  }
} 