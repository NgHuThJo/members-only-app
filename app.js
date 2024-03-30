const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const mongoStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");

// Routers
const indexRouter = require("./routes/index");

const app = express();
const port = process.env.PORT || 3000;

// Data base connection
const main = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
};

main().catch((err) => {
  console.log(err);
});

// Start server and listen on specified port and optional hostname
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session setup
app.use(
  session({
    secret: process.env.SECRET || "cats and dogs",
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      autoRemove: "interval",
      autoRemoveInterval: 10, // In minutes. Default.
    }),
  })
);
// Passport config
const strategy = require("./passport/passport");
passport.use(strategy);
app.use(passport.session());

// For debugging purposes
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// Express setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
