const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(cookieParser());

app.post("/register", (req, res) => {});
app.post("/login", (req, res) => {});
app.get("/logout", (req, res) => {});

app.listen(PORT, () => console.log(`http:localhost:${PORT}`));
