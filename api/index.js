// api/index.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('../db.json'); // Đường dẫn tương đối đến db.json
const middlewares = jsonServer.defaults();

// Sử dụng các middleware mặc định (ví dụ: CORS, logger)
server.use(middlewares);

// Sử dụng router để xử lý các yêu cầu API
server.use(router);

// Xử lý yêu cầu đến root endpoint
server.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

// Export server như một Vercel Serverless Function
module.exports = server;