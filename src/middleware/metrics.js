const promClient = require('prom-client');
const collectDefaultMetrics = promClient.collectDefaultMetrics;

// Create custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

const messagesSentTotal = new promClient.Counter({
  name: 'messages_sent_total',
  help: 'Total number of messages sent'
});

const activeConnections = new promClient.Gauge({
  name: 'websocket_connections_active',
  help: 'Number of active WebSocket connections'
});

// Start collecting default metrics
collectDefaultMetrics();

module.exports = {
  promClient,
  httpRequestDurationMicroseconds,
  messagesSentTotal,
  activeConnections
}; 