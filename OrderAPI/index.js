const http = require("http");

const port = process.env.API3_PORT_NUMBER;

const server = http.createServer();

server.listen(port, () => {
  console.log("Order API running on port " + port);
});