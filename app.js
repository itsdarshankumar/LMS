const express = require("express");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const session = require("express-session");
const cookie = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use(cookie());

app.use(
  session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, //1 day
    },
  })
);

const rootroute = require("./server/routers/loginroute.js");
const bookroute = require("./server/routers/bookroute.js");
app.use("/book", bookroute);
app.use("/", rootroute);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
