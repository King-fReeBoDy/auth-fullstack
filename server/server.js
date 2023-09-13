const express = require("express");
const jwt = require("jsonwebtoken");
const bcryt = require("bcrypt");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const PORT = 8080;

app.use(express.json());
const allowedOrigin = "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.get(
  "/",
  (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).send("Authorization header missing");
    }

    const [authType, token] = req.headers.authorization.split(" ");

    if (authType !== "Bearer" || !token) {
      return res.status(401).send("Invalid authorization header format");
    }

    try {
      const isValid = jwt.verify(token, process.env.ACCESSTOKEN);

      if (!isValid) {
        return res.status(401).send("Invalid authorization header format");
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  },
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({});

      console.log("users");

      res.status(200).send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

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

    const accessToken = jwt.sign(data, process.env.ACCESSTOKEN, {
      expiresIn: "3s",
    });
    const refreshToken = jwt.sign(data, process.env.REFRESHTOKEN, {
      expiresIn: "15m",
    });

    data.accessToken = accessToken;

    res.cookie("token", refreshToken, { httpOnly: true });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/refresh_token", (req, res) => {
  const cookies = req.cookies.token;

  if (!cookies) {
    return res.status(401).send("Not authorized");
  }

  try {
    const isValid = jwt.verify(cookies, process.env.REFRESHTOKEN);

    if (!isValid) {
      return res.status(401).send("Not authorized");
    }

    const data = {
      id: isValid.id,
      username: isValid.username,
      email: isValid.email,
    };

    const newAccessToken = jwt.sign(data, process.env.ACCESSTOKEN);

    data.accessToken = newAccessToken;

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).send("Logged out");
});

app.listen(PORT, () => console.log(`Serving on http:localhost:${PORT}`));
