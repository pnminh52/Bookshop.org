const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('../../Angular/db.json');  // Cập nhật đường dẫn tới db.json
const middlewares = jsonServer.defaults();

// Sử dụng cổng từ Vercel (hoặc mặc định là 3000 nếu không có)
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
