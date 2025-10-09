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
    // Check if the user is authorized to update the post
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
      select: {
        authorId: true,
      },
    });
    if (req.user.id !== post.authorId) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this post.' });
    }

    const json = req.body;

    const updatedPost = await prisma.post.update({
      where: {
        id: req.params.postId,
      },
      data: {
        title: json.title,
        text: json.text,
        published: json.published,
      },
    });

    res.json(updatedPost);
  },
  deletePost: async (req, res) => {
    // Check if the user is authorized to delete the post
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
    });
    if (req.user.id !== post.authorId) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this post.' });
    }

    await prisma.post.delete({
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

    res.json(comments);
  },
  addComment: async (req, res) => {
    const json = req.body;

    // Check if the comment is empty
    if (!json.text.trim()) {
      return res.status(400).json({ success: false, message: 'Cannot post empty comment.' });
    }

    const comment = await prisma.comment.create({
      data: {
        text: json.text.trim(),
        postId: req.params.postId,
        userId: req.user.id,
      },
    });

    res.json({ success: true, comment });
  },
  deleteComment: async (req, res) => {
    // Check if the user is authorized to delete the comment
    const comment = await prisma.comment.findUnique({
      where: {
        id: req.params.commentId,
      },
    });
    if (req.user.id !== comment.userId) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this comment.' });
    }

    await prisma.comment.delete({
      where: {
        id: req.params.commentId,
      },
    });

    res.json(comment);
  },
};
