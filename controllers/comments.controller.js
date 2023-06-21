const { User, Post, Comment } = require('../models');
const errors = require('../static/errors');

// 포스트 댓글 확인(공개)
const getComments = async (req, res) => {
  const postId = req.params.postId;

  // 해당 포스트의 댓글과 각 댓글의 유저 정보 가져오기
  try {
    const findPost = await Post.findByPk(postId);
    const findComment = await Comment.findAll({
      where: { postId },
      attributes: {
        exclude: ['userId', 'postId'],
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'role'],
        },
        {
          model: Post,
          attributes: ['id', 'title', 'content'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!findPost) return res.status(errors.noPost.status).send({ msg: errors.noPost.msg });
    res.send({ comments: findComment });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

// 포스트 댓글 작성(회원 전용)
const writeComments = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  try {
    const findPost = await Post.findByPk(postId);
    const content = req.body.content;

    if (!findPost) return res.status(errors.noPost.status).send({ msg: errors.noPost.msg });

    await Comment.create({ content, userId, postId });
    res.json({ msg: '댓글 작성 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

// 수정페이지에서 수정완료(올리기) 클릭
const editComments = async (req, res) => {
  const commentId = req.params.commentId;
  const content = req.body.content;

  try {
    const findComment = await Comment.findByPk(commentId);

    if (!findComment) return res.status(errors.noComment.status).send({ msg: errors.noComment.msg });

    // 수정일자 업데이트
    const update = { content };
    await Comment.update(update, { where: { id: commentId } });
    res.status(200).send({ msg: '댓글 수정 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

// 댓글 삭제하기
const deleteComments = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const findPost = await Post.findByPk(postId);
    const findComment = await Comment.findByPk(commentId);

    if (!findPost) return res.status(errors.noPost.status).send({ msg: errors.noPost.msg });

    if (!findComment) return res.status(errors.noComment.status).send({ msg: errors.noComment.msg });

    // 댓글 삭제
    await Comment.destroy({ where: { id: commentId } });
    res.status(200).send({ msg: `댓글 삭제 완료 (${commentId})` });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

module.exports = {
  getComments,
  writeComments,
  editComments,
  deleteComments,
};
