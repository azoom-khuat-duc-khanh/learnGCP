import express from "express";
import 'dotenv/config'
const app = express();
const port = 3000;

app.get("/health", function (req, res) {
  return res.sendStatus(200);
});

app.get("/secret", function (req, res) {
  const secret = process.env.SECRET;

  return res.send(secret);
});

app.listen(port, function () {
  console.log("App listening on port " + port);
});
