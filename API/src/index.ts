import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Get all Posts
app.get("/posts", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ posts });
  } catch (err: any) {
    next(err.message);
  }
});

//Get post By ID
app.get("/posts/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json({ post });
  } catch (err: any) {
    next(err.message);
  }
});

//Get Users posts By ID
app.get("users/:id/posts", async (req, res, next) => {
  const { id } = req.params;
  try {
    const usersWithPosts = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        posts: {
          where: {
            published: true,
          },
        },
      },
    });
    const posts = usersWithPosts?.posts;
    res.json({ posts });
  } catch (err: any) {
    next(err.message);
  }
});

//Create Post
app.post("/posts", async (req, res, next) => {
  try {
    const post = await prisma.post.create({
      data: {
        authorId: 1,
        ...req.body,
      },
    });
    res.json({ post });
  } catch (err: any) {
    next(err.message);
  }
});

//Update A Post
app.patch("/posts/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        ...req.body,
      },
    });
    res.json({ post });
  } catch (err: any) {
    next(err.message);
  }
});

//Delete A Post
app.delete("/posts/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200);
  } catch (err: any) {
    next(err.message);
  }
});

app.listen(process.env.PORT!, () => {
  console.log(`Server is running on port ${process.env.PORT!}`);
});
