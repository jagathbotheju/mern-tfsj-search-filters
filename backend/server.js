require("dotenv").config();
var cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const app = express();
connectDB();

//middleware
app.use(express.json());
app.use(cors());
//routes
app.use("/api", require("./routes/approutes"));

//errorHandler - below all routes
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
