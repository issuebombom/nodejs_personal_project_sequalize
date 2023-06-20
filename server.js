require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
// const path = require('path');

const HOST = '0.0.0.0';
const PORT = 3000;
const app = express();

// app.use('/routes', express.static(path.join(__dirname, 'routes')));
// app.use('/schemas', express.static(path.join(__dirname, 'schemas')));

const usersRouter = require('./routes/users.router');
const authorizationRouter = require('./routes/authorization.router');
const postsRouter = require('./routes/posts.router');

require('./schemas'); // moongoDB connect

app.use(express.json());
app.use(cookieParser()); // npm i cookie-parser

app.use('/users', usersRouter);
app.use('/auth', authorizationRouter);
app.use('/posts', postsRouter);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
