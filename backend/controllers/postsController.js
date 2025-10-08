const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  postsGet: async (req, res) => {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true } },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    if (posts.length === 0) {
      return res.json({ message: 'There are no posts.' });
    }

    res.json(posts);
  },
  postGet: async (req, res) => {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
      include: {
        author: { select: { id: true, username: true } },
        _count: { select: { comments: true } },
      },
    });

    // If the post doesn't exist, return status code
    if (!post) {
      return res.status(404).json({ message: 'Post does not exist.' });
    }

    res.json(post);
  },
  postCommentsGet: async (req, res) => {
    const comments = await prisma.comment.findMany({
      where: {
        postId: req.params.postId,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { date: 'desc' },
    });

    if (comments.length === 0) {
      return res.json({ message: 'There are no comments.' });
    }

    res.json(comments);
  },
};
