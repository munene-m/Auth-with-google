const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const fetch = require("node-fetch")
const session = require("express-session");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const { connectDB } = require("./config/db");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const predictionRoute = require("./routes/predictionRoute");
const sportRoute = require("./routes/sportRoute");
const adsRoute = require("./routes/imageAdRoute");
const timeRoute = require("./routes/timeRoute");
const gameScoreRoute = require("./routes/gameScoreRoute");
const paymentRecordsRoute = require("./routes/paymentRoutes");
const stripeRoute = require("./routes/stripeRoute");
const PORT = process.env.PORT || 4000;

connectDB();
const fetchDataFromServer = async () => {
  try {
    await fetch("https://farid-creations-server.onrender.com/current");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
// Call the function immediately when the server starts
fetchDataFromServer();

setInterval(fetchDataFromServer, 13 * 60 * 1000);
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set the Content Security Policy header
app.use(helmet());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // cookie will expire after 1 day (in milliseconds)
    },
  })
);

app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use("/predictions", predictionRoute);
app.use("/sports", sportRoute);
app.use("/ads", adsRoute);
app.use("/time", timeRoute);
app.use("/score", gameScoreRoute);
app.use("/currencyPrices", paymentRecordsRoute);
app.use("/stripe", stripeRoute);

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "client", "index.html");
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down...");

  console.log("Goodbye!");
  process.exit(0);
});
