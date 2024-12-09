window.ChatWidget = {
  init: function(config) {
    // Load widget styles
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = config.baseUrl + '/widget.css';
    document.head.appendChild(style);

    // Initialize widget
    const widget = new ChatWidget({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      position: config.position || 'bottom-right',
      theme: config.theme || {}
    });

    return widget;
  }
}; 