require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

const usersRouter = require('./routes/users.router');
const authorizationRouter = require('./routes/authorization.router');
const postsRouter = require('./routes/posts.router');

app.use(express.json());
app.use(cookieParser()); // npm i cookie-parser

app.use('/users', usersRouter);
app.use('/auth', authorizationRouter);
app.use('/posts', postsRouter);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
