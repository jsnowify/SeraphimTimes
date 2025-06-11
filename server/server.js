const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// --- DEFINITIVE CORS FIX ---
// This middleware will manually set the required headers for every request.
app.use((req, res, next) => {
  // Allow any origin to access the resource. For production, you might want to restrict this.
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Allow specific headers that the browser might send
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );

  // Allow specific HTTP methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  // Continue to the next middleware
  next();
});
// --- END OF CORS FIX ---

// We still use the cors() package as a fallback and for simplicity
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const newsRouter = require("./routes/news");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");

app.use("/news", newsRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
