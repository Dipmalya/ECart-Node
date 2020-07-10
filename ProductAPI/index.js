const http = require("http");

const port = process.env.API2_PORT_NUMBER;

const server = http.createServer();

server.listen(port, () => {
  console.log("Product API running on port " + port);
});