(function(window) {
    const ChatWidget = {
        init: function(config) {
            console.log('Chat Widget initialized with config:', config);
            
            // Create widget container
            const container = document.createElement('div');
            container.id = 'chat-widget-container';
            container.style.cssText = `
                position: fixed;
                ${config.position === 'bottom-right' ? 'right: 20px; bottom: 20px;' : 'left: 20px; bottom: 20px;'}
                z-index: 9999;
            `;

            // Create chat button
            const button = document.createElement('button');
            button.innerHTML = 'Chat';
            button.style.cssText = `
                background-color: ${config.theme?.primary || '#007bff'};
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            `;

            // Add click handler
            button.onclick = function() {
                console.log('Chat button clicked');
                // Add your chat window logic here
            };

            // Add elements to DOM
            container.appendChild(button);
            document.body.appendChild(container);
        }
    };

    // Export to window
    window.ChatWidget = ChatWidget;
})(window); 