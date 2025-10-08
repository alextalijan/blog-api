const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const postsRouter = require('./routes/postsRouter');

app.use('/posts', postsRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }

  console.log(`App listening to requests on port ${PORT}.`);
});
