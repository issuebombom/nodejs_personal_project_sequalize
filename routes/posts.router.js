const express = require('express');
const cookieParser = require('cookie-parser');

const postsController = require('../controllers/posts.controller');
const commentsController = require('../controllers/comments.controller');
const {
  verifyAccessToken,
  replaceAccessToken,
  verificationForPosts,
  verificationForComments,
} = require('../verification'); // 토큰 검증을 위한 미들웨어

const postsRouter = express.Router();
postsRouter.use(cookieParser());

// 전체 포스트 확인(공개)
postsRouter.get('/', postsController.getPosts);

// 포스트 작성
postsRouter.post('/', verifyAccessToken, replaceAccessToken, postsController.writePosts);

// 수정페이지에서 수정완료(올리기) 클릭
postsRouter.put(
  '/:postId',
  verifyAccessToken,
  replaceAccessToken,
  verificationForPosts,
  postsController.editPosts
);

// 포스트 삭제하기
postsRouter.delete(
  '/:postId',
  verifyAccessToken,
  replaceAccessToken,
  verificationForPosts,
  postsController.deletePosts
);

// 포스트 댓글 확인(공개)
postsRouter.get('/:postId/comments', commentsController.getComments);

// 포스트 댓글 작성(회원 전용)
postsRouter.post(
  '/:postId/comments',
  verifyAccessToken,
  replaceAccessToken,
  commentsController.writeComments
);

// 수정페이지에서 수정완료(올리기) 클릭
postsRouter.put(
  '/:postId/comments/:commentId',
  verifyAccessToken,
  replaceAccessToken,
  verificationForComments,
  commentsController.editComments
);

// 댓글 삭제하기
postsRouter.delete(
  '/:postId/comments/:commentId',
  verifyAccessToken,
  replaceAccessToken,
  verificationForComments,
  commentsController.deleteComments
);

module.exports = postsRouter;
