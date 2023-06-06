import express from "express";
import 'dotenv/config';
import got from "got";
import cron from "node-cron";

const app = express();
const port = process.env.PORT || 3000;

app.get("/health", function (req, res) {
  return res.sendStatus(200);
});

app.get("/secret", function (req, res) {
  const secret = process.env.SECRET;

  return res.send(secret);
});

app.listen(port, function () {
  console.log("App listening on port " + port);
  loop([{ xAccessToken }]);
});


const LOGIN_URL =
  "https://azoom-vn-hrm-api-kxvd4zxqka-an.a.run.app/authentications/login";

const URL = "https://azoom-vn-hrm-api-kxvd4zxqka-an.a.run.app/users/me";

const URL_CHECKOUT =
  "https://azoom-vn-hrm-api-kxvd4zxqka-an.a.run.app/timesheets/checkout";

const email = "bui.minh.quang@azoom.jp";

const xAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYXotMTQzIiwicG9zaXRpb25QZXJtaXNzaW9uSWQiOjEsImZ1bGxOYW1lIjoiQsO5aSBNaW5oIFF1YW5nIiwic2xhY2tJZCI6IiIsImlzUmVtb3RlYWJsZSI6ZmFsc2V9LCJpYXQiOjE2ODU5NjE3MTAsImV4cCI6MTY4NjIyMDkxMH0.YH7XvfXjZCptpuUHzk0Nv9lGSYAi-hYj_PPStcOmTps";

async function loop(users = []) {
  const beAbleToSend = checkBeAbleToSend();

  if (!beAbleToSend) return;

  const responseCheckin = await Promise.allSettled(
    users.map((user) => automaticCheckout(user))
  );
  console.log(responseCheckin);
}

function checkBeAbleToSend() {
  const now = new Date(
    new Date().toLocaleString("ja-JP", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const hour = now.getHours();
  const minute = now.getMinutes();
  return true;
}

async function automaticCheckout(user) {
  const { email, password, xAccessToken = "" } = user;
  let token = xAccessToken;
  if (email && password) {
    const accessToken = await login({ email, password });
    token = accessToken;
  }

  const requestClient = createRequestClient(token);

  // const response = await requestClient
  //   .post(URL_CHECKOUT)
  //   .json({ noteCheckout: "" })
  //   .catch(handleLockError);
  console.log(requestClient?.extend()?.defaults?.options?.headers);
  const response = await requestClient.get(URL).json().catch(handleLockError);
  return response || null;
}

async function login({ email, password }) {
  const { accessToken } = await got
    .post(LOGIN_URL, {
      json: {
        email,
        password,
      },
    })
    .json()
    .catch((err) => {
      console.log(err);
      return null;
    });
  return accessToken || null;
}

function createRequestClient(token) {
  return got.extend({
    retry: 0,
    headers: {
      "Content-Type": "application/json",
      "X-Access-Token": token,
      "x-forwarded-for": "210.245.49.88",
    },
  });
}

function handleLockError(error) {
  console.log(error);
  const errorBody = JSON.parse(error?.response?.body || "{}");
  const errorMessage = errorBody?.message;

  if (errorMessage) {
    return Promise.reject(new Error(errorMessage));
  }

  return Promise.reject(error);
}

// start the job
// cron.schedule("*/5 * * * *", function () {
//   loop([{ xAccessToken }]);
// });

// loop([{ xAccessToken }]);

