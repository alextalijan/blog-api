const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  getPosts: async (req, res) => {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true } },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (posts.length === 0) {
      return res.json({ message: 'There are no posts.' });
    }

    res.json(posts);
  },
  addPost: async (req, res) => {
    // Check if the user is authorized to add posts
    if (!req.user.isAuthor) {
      res.status(403).json({ success: false, message: 'Not authorized to add posts.' });
    }

    const json = req.body;

    const post = await prisma.post.create({
      data: {
        title: json.title,
        text: json.text,
        authorId: req.user.id,
      },
    });

    res.json(post);
  },
  getPost: async (req, res) => {
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
  updatePost: async (req, res) => {
    const json = req.body;

    const post = await prisma.post.update({
      where: {
        id: req.params.postId,
      },
      data: {
        title: json.title,
        text: json.text,
        published: json.published,
      },
    });

    res.json(post);
  },
  deletePost: async (req, res) => {
    const post = await prisma.post.delete({
      where: {
        id: req.params.postId,
      },
    });

    res.json(post);
  },
  getComments: async (req, res) => {
    const comments = await prisma.comment.findMany({
      where: {
        postId: req.params.postId,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (comments.length === 0) {
      return res.json({ message: 'There are no comments.' });
    }

    res.json(comments);
  },
  addComment: async (req, res) => {
    const json = req.body;

    const comment = await prisma.comment.create({
      data: {
        text: json.text,
        postId: req.params.postId,
        userId: req.user.id,
      },
    });

    res.json(comment);
  },
  deleteComment: async (req, res) => {
    const comment = await prisma.comment.delete({
      where: {
        id: req.params.commentId,
      },
    });

    res.json(comment);
  },
};
