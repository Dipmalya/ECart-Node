const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");

const dbConfig = require("../db.config");

const port = process.env.API1_PORT_NUMBER;

mongoose.connect(dbConfig.db, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("Connected to DB..");
});
mongoose.connection.on("error", () => {
  console.log("Failed to connect to DB..");
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log("Account API running on port " + port);
});