const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  getUser: async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userId,
      },
      select: {
        username: true,
        isAuthor: true,
        posts: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  },
};
