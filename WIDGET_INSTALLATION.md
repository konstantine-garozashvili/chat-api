# Chat Widget Installation Guide

1. Add the widget script to your HTML:
```html
<script src="https://your-api-url/widget.js"></script>
```

2. Initialize the widget with your API key:
```javascript
const chat = new ChatWidget({
  apiKey: 'your-api-key',
  position: 'bottom-right', // optional
  theme: {
    primary: '#007bff',    // optional
    secondary: '#6c757d'   // optional
  }
});

chat.initialize();
```

3. Customize the appearance through the dashboard at:
   https://your-api-url/dashboard

4. Add authorized domains in your dashboard to allow the widget to work on your websites. 