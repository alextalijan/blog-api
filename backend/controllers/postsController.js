const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  postsGet: async (req, res) => {
    const posts = await prisma.post.findMany({
      include: {
        comments: true,
        author: true,
      },
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
        author: true,
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
        user: true,
      },
    });

    if (comments.length === 0) {
      return res.json({ message: 'There are no comments.' });
    }

    res.json(comments);
  },
  postCommentGet: async (req, res) => {
    const comment = await prisma.comment.findUnique({
      where: {
        id: req.params.commentId,
      },
      include: {
        user: true,
      },
    });

    // If the comment doesn't exist, return status code
    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist.' });
    }

    res.json(comment);
  },
};
