const express = require("express");
const logger = require("morgan");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // use .env file as config
}

// App setup
const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes Setup
app.use("/", require("./controllers/mainCtrl"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`App is listening on port ${PORT}!`);
});
