import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRouter from "./routes/user";
import postsRouter from "./routes/posts";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { mockPosts, mockUsers } from "./utils/dataMocking";

dotenv.config();

export const prisma = new PrismaClient();
const app: Express = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use("/users", userRouter);
app.use("/posts", postsRouter);
const port = process.env.PORT;

if (
  !process.env.PORT ||
  !process.env.REFRESH_TOKEN_SECRET ||
  !process.env.ACCESS_TOKEN_SECRET ||
  !process.env.DATABASE_URL
) {
  throw Error("env dont match");
}

const mockData = async () => {
  await mockUsers(5);
  await mockPosts(500);
};
mockData();

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
