class Dashboard {
  constructor() {
    this.apiKey = null;
    this.settings = null;
    this.init();
  }

  async init() {
    await this.loadUserData();
    this.setupEventListeners();
    this.initializeWidgetPreview();
    await this.initializeAnalytics();
  }

  async loadUserData() {
    try {
      const response = await fetch('/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      this.apiKey = data.apiKey.key;
      this.settings = data.apiKey.settings;
      
      this.updateUI();
    } catch (error) {
      console.error('Error loading user data:', error);
      // Redirect to login if unauthorized
      if (error.status === 401) {
        window.location.href = '/login';
      }
    }
  }

  updateUI() {
    // Update API key display
    document.getElementById('apiKey').value = this.apiKey;

    // Update settings form
    const form = document.getElementById('settingsForm');
    form.position.value = this.settings.position;
    form.primaryColor.value = this.settings.theme.primary;
    form.secondaryColor.value = this.settings.theme.secondary;
    form.customCSS.value = this.settings.customCSS || '';

    // Update preview
    this.updatePreview();
  }

  setupEventListeners() {
    // Copy API key
    document.getElementById('copyApiKey').addEventListener('click', () => {
      const apiKeyInput = document.getElementById('apiKey');
      apiKeyInput.select();
      document.execCommand('copy');
      this.showToast('API key copied!');
    });

    // Settings form submission
    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.saveSettings();
    });

    // Real-time preview updates
    const inputs = document.querySelectorAll('#settingsForm input, #settingsForm select, #settingsForm textarea');
    inputs.forEach(input => {
      input.addEventListener('change', () => this.updatePreview());
    });
  }

  async saveSettings() {
    try {
      const form = document.getElementById('settingsForm');
      const settings = {
        position: form.position.value,
        theme: {
          primary: form.primaryColor.value,
          secondary: form.secondaryColor.value
        },
        customCSS: form.customCSS.value
      };

      const response = await fetch('/api/widget/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        this.showToast('Settings saved successfully!');
        this.settings = settings;
        this.updatePreview();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showToast('Error saving settings', 'error');
    }
  }

  initializeWidgetPreview() {
    // Create preview container
    const preview = document.createElement('div');
    preview.id = 'widget-preview';
    document.body.appendChild(preview);
    
    this.updatePreview();
  }

  updatePreview() {
    const preview = document.getElementById('widget-preview');
    const form = document.getElementById('settingsForm');
    
    // Apply current settings to preview
    preview.style.cssText = `
      position: fixed;
      ${form.position.value.includes('bottom') ? 'bottom: 20px' : 'top: 20px'};
      ${form.position.value.includes('right') ? 'right: 20px' : 'left: 20px'};
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      border: 2px solid ${form.primaryColor.value};
      ${form.customCSS.value}
    `;
  }

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  async initializeAnalytics() {
    await this.loadAnalytics();
    this.setupAnalyticsChart();
    // Update analytics every minute
    setInterval(() => this.loadAnalytics(), 60000);
  }

  async loadAnalytics() {
    try {
      const response = await fetch('/api/widget/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      this.updateAnalyticsUI(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  updateAnalyticsUI(data) {
    // Update counters
    document.getElementById('totalConversations').textContent = data.conversations;
    document.getElementById('activeUsers').textContent = data.activeUsers;
    document.getElementById('messagesSent').textContent = data.messages;

    // Update chart
    this.updateChart(data.chartData);
  }

  setupAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Messages',
          data: [],
          borderColor: '#3b82f6',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

// Initialize dashboard
new Dashboard(); 