# Chat Widget API

A simple, embeddable real-time chat widget that you can easily integrate into any website.

## Quick Start

Add this code to your HTML:

```html
<!-- Socket.IO Client (required) -->
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

<!-- Add Chat Widget -->
<script src="https://chat-api-28qc.onrender.com/widget.js"></script>
<script>
    ChatWidget.init({
        apiKey: 'LaplateformeKG',
        position: 'bottom-right',
        userData: {
            username: 'John Doe',  // User's name in chat
            userId: '123',         // Your system's user ID
            company: 'ACME Inc'    // Any custom data
        },
        theme: {
            primary: '#007bff',
            secondary: '#6c757d'
        },
        onMessage: function(data) {
            // Handle received messages
            console.log('New message:', data);
            // Save to your database, update UI, etc.
        }
    });
</script>
```

## Features

- 🚀 Real-time chat functionality
- 🎨 Fully customizable theme
- 📱 Responsive design
- 💾 Custom data support
- 🔌 Easy integration
- 🌐 Cross-domain support
- 🔒 Secure communication

## Configuration Options

| Option | Type | Required | Description | Default |
|--------|------|----------|-------------|---------|
| apiKey | string | Yes | Authentication key | 'LaplateformeKG' |
| position | string | No | Widget position | 'bottom-right' |
| theme | object | No | Custom colors | See below |
| userData | object | No | Custom user data | {} |
| onMessage | function | No | Message callback | null |
| backendUrl | string | No | Custom backend URL | Our server |

### Position Options
- 'bottom-right'
- 'bottom-left'

### Theme Options
```javascript
{
    primary: '#007bff',   // Main color (buttons, header)
    secondary: '#6c757d'  // Secondary color (accents)
}
```

### userData Options
```javascript
{
    username: 'John Doe',     // User's display name
    userId: '123',            // Your system's user ID
    company: 'ACME Inc',      // Company name
    // Add any custom fields
    role: 'admin',
    department: 'sales',
    // ...
}
```

### Event Callbacks
```javascript
{
    onMessage: function(data) {
        // data contains:
        // - from: sender's username
        // - text: message content
        // - timestamp: message time
        // - userData: sender's custom data
    }
}
```

## Advanced Usage

### Custom Backend Integration
```javascript
ChatWidget.init({
    apiKey: 'LaplateformeKG',
    backendUrl: 'https://your-server.com',
    onMessage: async function(data) {
        // Save message to your database
        await fetch('https://your-server.com/api/messages', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
});
```

### Multiple Chat Instances
```html
<!-- Support Chat -->
<script>
ChatWidget.init({
    apiKey: 'LaplateformeKG',
    userData: { department: 'support' }
});
</script>

<!-- Sales Chat -->
<script>
ChatWidget.init({
    apiKey: 'LaplateformeKG',
    userData: { department: 'sales' }
});
</script>
```

## Technical Details

- Built with vanilla JavaScript (no dependencies except Socket.IO)
- Uses Socket.IO for real-time communication
- Supports all modern browsers
- Lightweight (~10KB gzipped)
- No jQuery required

## Limitations

Free tier includes:
- Up to 100 simultaneous connections
- 512MB storage (MongoDB Atlas)
- Shared resources
- Basic features

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11+ (with polyfills)

## Security

- All communications over HTTPS
- API key authentication
- Rate limiting enabled
- XSS protection
- CORS configured

## Examples

Check out our example implementations:
- [Basic Integration](https://chat-api-28qc.onrender.com/example/test-widget.html)
- [Custom Styling](https://chat-api-28qc.onrender.com/example/styled.html)
- [Multiple Chats](https://chat-api-28qc.onrender.com/example/multiple.html)

## Support

- [Open an Issue](https://github.com/yourusername/chat-api/issues)
- [Documentation](https://chat-api-28qc.onrender.com/docs)
- [API Reference](https://chat-api-28qc.onrender.com/api-docs)

## License

MIT License - feel free to use in your projects!