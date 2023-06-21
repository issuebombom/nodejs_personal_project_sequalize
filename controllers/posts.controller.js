const { User, Post, Comment } = require('../models');
const errors = require('../static/errors');

// 전체 포스트 확인(공개)
const getPosts = async (req, res) => {
  try {
    const getPosts = await Post.findAll({
      attributes: {
        exclude: ['userId'],
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'role'],
        },
        {
          model: Comment,
          attributes: ['content'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (getPosts.length === 0)
      return res.status(errors.noPost.status).send({ msg: errors.noPost.msg });
    res.send({ posts: getPosts });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

// 포스트 작성
const writePosts = async (req, res) => {
  const userId = req.user.id;

  try {
    const findUser = await User.findByPk(userId);

    // find 결과가 null일 경우
    if (!findUser) return res.status(errors.noUser.status).send({ msg: errors.noUser.msg });

    const { title, content } = req.body;
    await Post.create({ title, content, userId });

    res.json({ msg: '게시글 작성 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

// 수정페이지에서 수정완료(올리기) 클릭
const editPosts = async (req, res) => {
  const postId = req.params.postId;
  const { title, content } = req.body;

  try {
    const findPost = await Post.findByPk(postId);

    // find 결과가 null일 경우
    if (!findPost) return res.status(errors.noPost.status).send({ msg: errors.noPost.msg });

    // 수정내용 업데이트
    const update = { title, content };
    await Post.update(update, { where: { id: postId } });

    res.status(200).send({ msg: '게시글 수정 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

// 포스트 삭제하기
const deletePosts = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const findPost = await Post.findByPk(postId);

    // find 결과가 null일 경우
    if (!findPost) return res.status(errors.noPost.status).send({ msg: errors.noPost.msg });

    // 포스트 삭제
    await Post.destroy({ where: { id: postId } });

    res.status(200).send({ msg: `게시글 삭제 완료 (${postId})` });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

module.exports = {
  getPosts,
  writePosts,
  editPosts,
  deletePosts,
};
