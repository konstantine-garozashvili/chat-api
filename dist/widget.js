(function(window) {
    const ChatWidget = {
        init: function(config) {
            this.config = {
                debug: true,  // Enable debug mode
                ...config
            };
            console.log('Chat Widget initialized with config:', this.config);
            this.isOpen = false;
            this.createWidgetElements();
        },

        createWidgetElements: function() {
            // Create widget container
            const container = document.createElement('div');
            container.id = 'chat-widget-container';
            container.style.cssText = `
                position: fixed;
                ${this.config.position === 'bottom-right' ? 'right: 20px; bottom: 20px;' : 'left: 20px; bottom: 20px;'}
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
            `;

            // Add click handler
            button.onclick = () => {
                console.log('Chat button clicked');
                this.toggleChat();
            };

            // Add elements to DOM
            container.appendChild(button);
            document.body.appendChild(container);
        },

        toggleChat: function() {
            this.isOpen = !this.isOpen;
            console.log('Chat toggled:', this.isOpen);
        }
    };

    // Export to window
    window.ChatWidget = ChatWidget;
})(window); 