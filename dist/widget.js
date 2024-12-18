(function(window) {
    const ChatWidget = {
        init: function(config) {
            this.config = {
                apiKey: config.apiKey,
                position: config.position || 'bottom-right',
                theme: config.theme || {},
                backendUrl: config.backendUrl,
                onMessage: config.onMessage,
                userData: config.userData || {}
            };
            this.isOpen = false;
            this.createElements();
            this.initializeSocket();
        },

        createElements: function() {
            // Create container
            const container = document.createElement('div');
            container.id = 'chat-widget-container';
            container.style.cssText = `
                position: fixed;
                ${this.config.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'};
                bottom: 20px;
                z-index: 9999;
            `;

            // Create chat button
            const button = document.createElement('button');
            button.innerHTML = 'Chat';
            button.style.cssText = `
                background-color: ${this.config.theme?.primary || '#007bff'};
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
            `;

            // Create chat window
            const chatWindow = document.createElement('div');
            chatWindow.style.cssText = `
                display: none;
                position: fixed;
                bottom: 100px;
                ${this.config.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'};
                width: 300px;
                height: 400px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                flex-direction: column;
                overflow: hidden;
            `;

            // Create chat header
            const header = document.createElement('div');
            header.style.cssText = `
                background-color: ${this.config.theme?.primary || '#007bff'};
                color: white;
                padding: 15px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            header.innerHTML = `
                <span>Chat Support</span>
                <button style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 20px;
                ">×</button>
            `;

            // Create chat messages area
            const messagesArea = document.createElement('div');
            messagesArea.style.cssText = `
                flex-grow: 1;
                padding: 15px;
                overflow-y: auto;
            `;

            // Create input area
            const inputArea = document.createElement('div');
            inputArea.style.cssText = `
                padding: 15px;
                border-top: 1px solid #eee;
                display: flex;
            `;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Type a message...';
            input.style.cssText = `
                flex-grow: 1;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-right: 8px;
            `;

            const sendButton = document.createElement('button');
            sendButton.innerHTML = 'Send';
            sendButton.style.cssText = `
                background-color: ${this.config.theme?.primary || '#007bff'};
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
            `;

            // Add send functionality
            const sendMessage = () => {
                const text = input.value.trim();
                if (text) {
                    this.sendMessage(text);
                    input.value = '';
                }
            };

            // Add event listeners
            sendButton.addEventListener('click', sendMessage);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            inputArea.appendChild(input);
            inputArea.appendChild(sendButton);

            // Add click handlers
            button.onclick = () => this.toggleChat(chatWindow, button);
            header.querySelector('button').onclick = () => this.toggleChat(chatWindow, button);

            // Assemble chat window
            chatWindow.appendChild(header);
            chatWindow.appendChild(messagesArea);
            chatWindow.appendChild(inputArea);

            // Add everything to container
            container.appendChild(chatWindow);
            container.appendChild(button);
            document.body.appendChild(container);

            // Store references
            this.chatWindow = chatWindow;
            this.messagesArea = messagesArea;
            this.button = button;
            this.input = input;
        },

        toggleChat: function(chatWindow, button) {
            this.isOpen = !this.isOpen;
            chatWindow.style.display = this.isOpen ? 'flex' : 'none';
            button.style.transform = this.isOpen ? 'scale(0.8)' : 'scale(1)';
        },

        initializeSocket: function() {
            const socket = io(this.config.backendUrl || 'https://chat-api-28qc.onrender.com', {
                auth: {
                    apiKey: this.config.apiKey,
                    userData: this.config.userData
                }
            });

            socket.on('connect', () => {
                console.log('Connected to chat server');
            });

            socket.on('message', (data) => {
                this.addMessage(data.from, data.text);
                if (this.config.onMessage) {
                    this.config.onMessage(data);
                }
            });

            this.socket = socket;
        },

        sendMessage: function(text) {
            if (!text.trim()) return;

            this.socket.emit('message', {
                text,
                apiKey: this.config.apiKey,
                userData: this.config.userData
            });

            this.addMessage('You', text);
        },

        addMessage: function(sender, text) {
            const message = document.createElement('div');
            message.className = `chat-message ${sender === 'You' ? 'sent' : 'received'}`;
            message.innerHTML = `<strong>${sender}:</strong> ${text}`;
            this.messagesArea.appendChild(message);
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }
    };

    window.ChatWidget = ChatWidget;
})(window); 