import express from "express";
import 'dotenv/config'
const app = express();
const port = process.env.PORT || 3000;

app.get("/health", function (req, res) {
  return res.sendStatus(200);
});

app.get("/secret", function (req, res) {
  const date = new Date()
  
  return res.send(`${date}`);
});

app.listen(port, function () {
  console.log("App listening on port " + port);
});
