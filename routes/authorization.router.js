const express = require('express');

const authorizationController = require('../controllers/authorization.controller');
const authorizationRouter = express.Router();

authorizationRouter.post('/login', authorizationController.login);

module.exports = authorizationRouter;
