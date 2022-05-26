const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
// Route files
const authRoute = require("./routes/auth.js");
const addressRoute = require("./routes/address.js");

connectToMongo();

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoute);
app.use("/api/address", addressRoute);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
