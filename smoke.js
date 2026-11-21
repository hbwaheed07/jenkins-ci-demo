// Starts the app, checks /health once, then exits.
// Used by the "Deploy to Test" stage as a basic deployment check.
const http = require('http');
const app = require('./app');

const server = app.listen(3001, () => {
  http.get('http://localhost:3001/health', (res) => {
    console.log('Health check status: ' + res.statusCode);
    server.close();
    process.exit(res.statusCode === 200 ? 0 : 1);
  }).on('error', (err) => {
    console.error('Health check failed: ' + err.message);
    server.close();
    process.exit(1);
  });
});
