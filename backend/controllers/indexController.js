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
      },
    });

    // Create a jwt token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    res.json({ success: true, message: 'User created.', token });
  },
};
