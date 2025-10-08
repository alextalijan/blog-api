const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  getUsers: async (req, res) => {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      return res.json({ message: 'No users exist.' });
    }

    res.json(users);
  },
  getUser: async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userId,
      },
      include: {
        posts: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  },
};
