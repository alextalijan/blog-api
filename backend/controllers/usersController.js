const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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
  updatePassword: async (req, res) => {
    // If user is not authorized, don't allow it
    if (req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to change password.' });
    }

    const { password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: req.params.userId,
      },
      data: {
        hash,
      },
    });

    res.json({ success: true, message: 'Password updated.' });
  },
};
