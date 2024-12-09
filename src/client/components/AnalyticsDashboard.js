class AnalyticsDashboard {
  constructor(container) {
    this.container = container;
    this.charts = {};
    this.init();
  }

  async init() {
    await this.loadData();
    this.createCharts();
    this.setupRealTimeUpdates();
  }

  async loadData() {
    const [stats, messages, users] = await Promise.all([
      this.fetchStats(),
      this.fetchMessageHistory(),
      this.fetchActiveUsers()
    ]);

    this.data = { stats, messages, users };
  }

  createCharts() {
    // Messages per day chart
    this.charts.messages = new Chart(
      document.getElementById('messagesChart'),
      {
        type: 'line',
        data: this.getMessageChartData(),
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      }
    );

    // User activity chart
    this.charts.users = new Chart(
      document.getElementById('usersChart'),
      {
        type: 'bar',
        data: this.getUserChartData(),
        options: {
          responsive: true
        }
      }
    );
  }

  setupRealTimeUpdates() {
    const socket = io();
    
    socket.on('newMessage', () => {
      this.updateMessageCount();
    });

    socket.on('userStatus', (data) => {
      this.updateUserStatus(data);
    });
  }

  // Helper methods for data formatting
  getMessageChartData() {
    // Process message history into chart format
    const dates = this.data.messages.reduce((acc, msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(dates),
      datasets: [{
        label: 'Messages',
        data: Object.values(dates),
        borderColor: '#3b82f6'
      }]
    };
  }

  getUserChartData() {
    // Process user activity into chart format
    return {
      labels: ['Active', 'Inactive'],
      datasets: [{
        data: [
          this.data.users.filter(u => u.status === 'online').length,
          this.data.users.filter(u => u.status === 'offline').length
        ],
        backgroundColor: ['#10b981', '#ef4444']
      }]
    };
  }
} 