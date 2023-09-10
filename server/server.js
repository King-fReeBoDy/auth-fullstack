const express = require("express");
const jwt = require("jsonwebtoken");
const bcryt = require("bcrypt");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.send("Enter all credentials");
  }

  try {
    const salt = await bcryt.genSalt(10);
    const hashPassword = await bcryt.hash(password, salt);
    const user = await prisma.create({
      data: { username, email, password: hashPassword },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal error");
  }
});
app.post("/login", (req, res) => {});
app.get("/logout", (req, res) => {});

app.listen(PORT, () => console.log(`http:localhost:${PORT}`));
