# Chat Widget API

*Read this in other languages: [English](#english), [Français](#français)*

# English

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
            username: 'John Doe',
            userId: '123'
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
    company: 'ACME Inc'       // Company name
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

---

# Français

Un widget de chat en temps réel simple et intégrable que vous pouvez facilement ajouter à n'importe quel site web.

## Démarrage Rapide

Ajoutez ce code à votre HTML :

```html
<!-- Client Socket.IO (requis) -->
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

<!-- Ajouter le Widget de Chat -->
<script src="https://chat-api-28qc.onrender.com/widget.js"></script>
<script>
    ChatWidget.init({
        apiKey: 'LaplateformeKG',
        position: 'bottom-right', // ou 'bottom-left'
        userData: {
            username: 'John Doe',
            userId: '123'
        }
    });
</script>
```

## Fonctionnalités

- Chat en temps réel
- Thème personnalisable
- Design responsive
- Support de données personnalisées
- Intégration facile
- Support multi-domaines
- Communication sécurisée

## Options de Configuration

| Option | Type | Description | Défaut |
|--------|------|-------------|---------|
| apiKey | string | Clé d'API | 'LaplateformeKG' |
| position | string | Position du widget | 'bottom-right' |
| theme | object | Couleurs personnalisées | Voir ci-dessous |
| userData | object | Données utilisateur | {} |

### Options de Thème
```javascript
{
    primary: '#007bff',   // Couleur principale
    secondary: '#6c757d'  // Couleur secondaire
}
```

### Options userData
```javascript
{
    username: 'John Doe',     // Nom d'affichage
    userId: '123',            // ID utilisateur
    company: 'ACME Inc'       // Nom de l'entreprise
}
```

## Limitations

Version gratuite inclut :
- Jusqu'à 100 connexions simultanées
- 512MB de stockage (MongoDB Atlas)
- Ressources partagées
- Fonctionnalités de base

## Support

- [Ouvrir un ticket](https://github.com/yourusername/chat-api/issues)
- [Documentation](https://chat-api-28qc.onrender.com/docs)
- [Référence API](https://chat-api-28qc.onrender.com/api-docs)

## Licence

Licence MIT - libre d'utilisation dans vos projets !

## Usage Restrictions
This repository is public for reference only. You may not:
- Clone for commercial use
- Modify or redistribute the code
- Use in production without permission

For licensing and usage requests, please contact: konstantine.garozashvili@laplateforme.io