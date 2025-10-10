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
        posts: {
          where: {
            published: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, user });
  },
  updatePassword: async (req, res) => {
    // If user is not authorized, don't allow it
    if (req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to change password.' });
    }

    const { password, passwordConfirmation } = req.body;

    // If the password is empty, stop the user
    if (!password.trim()) {
      return res.status(400).json({ success: false, message: 'Empty password.' });
    }

    // If the password and confirmation do not match, stop user from proceeding
    if (password !== passwordConfirmation) {
      return res
        .status(400)
        .json({ success: false, message: 'Confirmation does not match password.' });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        hash,
      },
    });

    res.json({ success: true, message: 'Password updated.' });
  },
};
