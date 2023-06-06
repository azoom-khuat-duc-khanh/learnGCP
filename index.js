import express from "express";
import "dotenv/config";
const app = express();
const port = process.env.PORT || 3000;

app.get("/health", function (req, res) {
  return res.sendStatus(200);
});

app.get("/secret", function (req, res) {
  const secret = process.env.SECRET;
  console.log(
    "req.headers['x-forwarded-for']::",
    req.headers["x-forwarded-for"]
  );
  console.log("req.connection.remoteAddress::", req.connection.remoteAddress);
  console.log("req.socket.remoteAddress::", req.socket.remoteAddress);
  console.log(
    "req.connection.socket ? req.connection.socket.remoteAddress : null::",
    req.connection.socket ? req.connection.socket.remoteAddress : null
  );

  return res.send(secret);
});

app.listen(port, function () {
  console.log("App listening on port " + port);
});
