# Chat Widget API

A simple, embeddable chat widget that you can add to any website.

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
        position: 'bottom-right', // or 'bottom-left'
        theme: {
            primary: '#007bff',
            secondary: '#6c757d'
        }
    });
</script>
```

## Features

- Real-time chat functionality
- Customizable position and theme
- Message history
- Typing indicators
- Message delivery status

## Configuration Options

| Option   | Type   | Description | Default |
|----------|--------|-------------|---------|
| apiKey   | string | Your API key | Required |
| position | string | Widget position ('bottom-right' or 'bottom-left') | 'bottom-right' |
| theme    | object | Custom colors | See below |

### Theme Options

```javascript
{
    primary: '#007bff',   // Main color
    secondary: '#6c757d'  // Secondary color
}
```

## Live Demo

Try it out: [Demo Page](https://your-api-url.com/example/test-widget.html)

## MongoDB Atlas Free Tier Limits

This API uses MongoDB Atlas free tier which includes:
- 512MB storage
- Shared RAM and vCPU
- Up to 100 connections

## Support

For issues and feature requests, please [open an issue](https://github.com/yourusername/chat-api/issues).