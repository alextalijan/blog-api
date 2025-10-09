const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

module.exports = {
  register: async (req, res) => {
    const json = req.body;

    const hash = await bcrypt.hash(json.password, 10);
    const user = await prisma.user.create({
      data: {
        username: json.username,
        hash,
      },
      select: {
        id: true,
        isAuthor: true,
      },
    });

    // Create a jwt token
    const token = jwt.sign({ userId: user.id, isAuthor: user.isAuthor }, process.env.JWT_SECRET, {
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    res.json({ success: true, message: 'User created.', token });
  },
  login: async (req, res) => {
    const json = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username: json.username,
      },
    });

    // Verify user
    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist.' });
    }
    const passwordMatch = await bcrypt.compare(json.password, user.hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Password is incorrect.' });
    }

    // Generate jwt token
    const token = jwt.sign(
      { userId: user.id, username: user.username, isAuthor: user.isAuthor },
      process.env.JWT_SECRET,
      {
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      }
    );

    res.json({ success: true, message: 'Logged in.', token });
  },
};
