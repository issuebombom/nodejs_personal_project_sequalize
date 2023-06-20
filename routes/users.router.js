const express = require('express');
const usersRouter = express.Router();

const usersController = require('../controllers/users.controller');

// 유저 조회
usersRouter.get('/', usersController.getUsers);

// 유저 조회(개별)
usersRouter.get('/:userId', usersController.getUser);

// 포스트 조회(유저 개별)
usersRouter.get('/:userId/posts', usersController.getPostsByUser);

// 회원가입
usersRouter.post('/', usersController.signUp);

module.exports = usersRouter;
