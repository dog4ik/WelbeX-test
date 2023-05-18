import express, { Request, Response } from "express";
const router = express.Router();
import authenticateToken from "../utils/authonticateToken";
import { prisma } from "..";

const TAKE_AMOUNT = 20;

type PaginetedBody = {
  page?: number;
};

type CreatePostType = {
  message?: string;
  media?: string;
};

type DeletePostType = {
  postId?: string;
};

type EditPostType = {
  postId?: string;
  message?: string;
  media?: string;
};

//get posts
router.get("/", async (req: Request<{}, {}, PaginetedBody>, res: Response) => {
  const { page } = req.query;
  const parsedPage = page ? +page : 1;
  if (isNaN(parsedPage) || parsedPage <= 0)
    return res.status(400).json({ message: "page number is not valid" });
  try {
    const posts = await prisma.post.findMany({
      skip: (parsedPage - 1) * TAKE_AMOUNT,
      take: TAKE_AMOUNT,
    });

    res.status(200).json(posts);
  } catch (e) {
    console.log(e);

    res.status(500).json();
  }
});

router.post(
  "/create",
  authenticateToken,
  async (req: Request<{}, {}, CreatePostType>, res: Response) => {
    if (!req.body.media && !req.body.message)
      return res.status(400).json({ message: "Empty post" });

    let userId = res.get("user_id")!;
    try {
      await prisma.post.create({
        data: {
          message: req.body.message,
          media: req.body.media,
          authorId: userId,
        },
      });
      return res.status(201).send();
    } catch (_) {
      return res.status(500).send();
    }
  }
);

router.put(
  "/edit",
  authenticateToken,
  async (req: Request<{}, {}, EditPostType>, res: Response) => {
    if (!req.body.media && !req.body.message)
      return res.status(400).json({ message: "Empty post" });

    let userId = res.get("user_id")!;
    try {
      let post = await prisma.post.findFirst({
        where: { id: req.body.postId, authorId: userId },
      });
      if (!post) return res.status(400).json({ message: "Post not found" });
      await prisma.post.update({
        where: { id: post.id },
        data: { media: req.body.media, message: req.body.message },
      });
      return res.status(204).send();
    } catch (_) {
      return res.status(500).send();
    }
  }
);

router.delete(
  "/delete",
  authenticateToken,
  async (req: Request<{}, {}, DeletePostType>, res: Response) => {
    if (!req.body.postId)
      return res.status(400).json({ message: "Id required" });

    let userId = res.get("user_id")!;
    try {
      let post = await prisma.post.findFirst({
        where: { id: req.body.postId, authorId: userId },
      });
      if (!post) return res.status(400).json({ message: "Post not found" });
      await prisma.post.delete({
        where: { id: post.id },
      });
      return res.status(204).send();
    } catch (_) {
      return res.status(500).send();
    }
  }
);
export default router;
