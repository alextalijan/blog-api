const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const postsRouter = require('./routes/postsRouter');
const usersRouter = require('./routes/usersRouter');

// Allow the app to parse incoming JSON objects in request
app.use(express.json());

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }

  console.log(`App listening to requests on port ${PORT}.`);
});
