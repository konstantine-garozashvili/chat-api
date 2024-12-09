class ChatWidget {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.position = config.position || 'bottom-right';
    this.theme = config.theme || {};
    this.serverUrl = config.serverUrl || 'http://localhost:3000';
    this.container = null;
    this.socket = null;
  }

  async initialize() {
    // Verify API key and get settings
    const response = await fetch(`${this.serverUrl}/api/widget/settings`, {
      headers: { 'X-API-Key': this.apiKey }
    });
    const settings = await response.json();

    // Create widget container
    this.container = document.createElement('div');
    this.container.id = 'chat-widget-container';
    this.applyStyles(settings);
    document.body.appendChild(this.container);

    // Initialize Socket.IO connection
    this.initializeSocket();

    // Add chat UI
    this.renderChatUI();
  }

  applyStyles(settings) {
    const styles = document.createElement('style');
    styles.textContent = `
      #chat-widget-container {
        position: fixed;
        ${settings.position.includes('bottom') ? 'bottom: 20px' : 'top: 20px'};
        ${settings.position.includes('right') ? 'right: 20px' : 'left: 20px'};
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        z-index: 1000;
        ${settings.customCSS || ''}
      }
    `;
    document.head.appendChild(styles);
  }

  // ... more widget methods
} 