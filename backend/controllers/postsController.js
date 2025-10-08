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
      res.json({ message: 'There are no posts.' });
    }

    res.json(posts);
  },
};
