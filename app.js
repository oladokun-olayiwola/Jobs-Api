require("dotenv").config();
require("express-async-errors");
const express = require("express");
const xss = require('xss-clean')
const cors = require('cors')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')

const connectDB = require("./db/connect");

const Authentication = require('./middleware/authentication')

const AuthRouter = require("./routes/auth");
const JobsRouter = require("./routes/jobs");

const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const app = express();

app.use(express.json());
app.use(cors());
app.use(xss());
app.use(helmet());
app.set("trust proxy", 1);
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter)


app.use("/api/v1/auth", Authentication, AuthRouter);
app.use("/api/v1/jobs", Authentication, JobsRouter);

app.use(notFound);
app.use(errorHandler);

PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Listening to your server on port ${PORT} sir 😀`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
