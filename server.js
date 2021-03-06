const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const enforce = require("express-sslify");
const farmproduce = require("./controllers/farmproduce");
const register = require("./controllers/register");
const signin = require("./controllers/signin");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.get("/", (req, res) => {
  res.send("This is the intelligent farm BuildForSDG project server.");
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.get("/farmproduce", (req, res) => {
  farmproduce.handleGetFarmproduce(req, res, db);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/payment", (req, res) => {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd",
  };
  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
