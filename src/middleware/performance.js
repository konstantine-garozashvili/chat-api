const Performance = require('../models/Performance');

async function trackPerformance(req, res, next) {
  const start = process.hrtime();

  res.on('finish', async () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    try {
      await Performance.create({
        path: req.path,
        method: req.method,
        duration,
        statusCode: res.statusCode,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error tracking performance:', error);
    }
  });

  next();
}

module.exports = trackPerformance; 