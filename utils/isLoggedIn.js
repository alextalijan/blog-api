const jwt = require('jsonwebtoken');
require('dotenv').config();

function isLoggedIn(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    // Check if the token is valid
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(401).json({ success: false, message: err.message });
      }

      req.user = {
        id: payload.userId,
        isAuthor: payload.isAuthor,
      };
      next();
    });
  } else {
    res.status(401).json({ success: false, message: 'Missing authorization header.' });
  }
}

module.exports = isLoggedIn;
