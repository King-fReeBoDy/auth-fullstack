const express = require("express");
const jwt = require("jsonwebtoken");
const bcryt = require("bcrypt");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Enter all credentials");
  }

  try {
    const isExist = await prisma.user.findUnique({ where: { email } });

    if (isExist) {
      return res.status(400).send("User already exist");
    }

    const salt = await bcryt.genSalt(10);
    const hashPassword = await bcryt.hash(password, salt);

    const user = await prisma.user.create({
      data: { username, email, password: hashPassword },
    });

    res.status(201).send("User created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Enter all credentials");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json("No user found");
    }

    const comparePassword = await bcryt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).send("Wrong credentials");
    }

    data = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = jwt.sign(user, process.env.ACCESSTOKEN, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(user, process.env.REFRESHTOKEN, {
      expiresIn: "15m",
    });

    data.accessToken = accessToken;

    res.cookie("token", refreshToken, {
      secure: false,
      httpOnly: true,
      path: "/refreshtoken",
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/refresh-token", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Not authorized");
  }

  try {
    const isValid = jwt.verify(token, "jwtrefreshtoken");
    if (!isValid) {
      return res.status(401).send("Not authorized");
    }
    res.status(200).json({ user: isValid });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token", { path: "/refreshtoken" });
  res.status(200).send("Logged out");
});

app.listen(PORT, () => console.log(`Serving on http:localhost:${PORT}`));
