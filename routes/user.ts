import express, { Request } from "express";
import bycript from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
import authenticateToken, { TokenData } from "../utils/authonticateToken";
import { prisma } from "..";

type CreateType = {
  username?: string;
  password?: string;
};

type LoginType = {
  username?: string;
  password?: string;
};

router.get("/info", authenticateToken, async (req, res) => {
  let user_id = res.get("user_id");
  if (!user_id) {
    res.status(500).send();
    return;
  }
  try {
    let user = await prisma.user.findFirst({ where: { id: user_id } });
    console.log(user?.username + " got user info");
    if (user == null) {
      return res.status(404).json({ message: "[login]Cannot find user" });
    }
    res.json(user);
  } catch (_) {
    res.status(500).json();
  }
});

router.post("/register", async (req: Request<{}, {}, CreateType>, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send();
    return;
  }
  try {
    const passwordHash = await bycript.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: passwordHash,
      },
    });
    const access_token = genereateAccessToken({ id: user.id });
    const refresh_token = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!
    );
    res.json({ access_token, refresh_token });
  } catch (err: any) {
    if (err?.code === "P2002") {
      res.status(409).json({ message: "user already exists" });
    } else {
      res.status(500).send();
    }
  }
});

router.post("/login", async (req: Request<{}, {}, LoginType>, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send();
    return;
  }
  try {
    let user = await prisma.user.findFirst({
      where: { username: req.body.username },
    });
    if (user == null) {
      return res.status(401).json({ message: "Credentials are incorrect" });
    }
    if (await bycript.compare(req.body.password, user.password)) {
    } else {
      return res.status(401).json({ message: "Credentials are incorrect" });
    }
    const access_token = genereateAccessToken({ id: user.id });
    const refresh_token = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!
    );
    res.json({ access_token, refresh_token });
  } catch (err) {
    res.status(500).json();
  }
});

router.post("/refresh", async (req, res) => {
  const refresh_token = req.body.token;
  if (!refresh_token)
    return res.status(401).json({ message: "No token provided" });
  try {
    let token_data = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as TokenData;
    const access_token = genereateAccessToken({ id: token_data.id });
    res.json({ access_token });
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

function genereateAccessToken(user: TokenData) {
  console.log(user.id + " genereated access token");
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
}

export default router;
