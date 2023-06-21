const { User, Post, Comment } = require('../models');

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
      sort: [['createdAt', 'DESC']], // order도 가능
    });

    if (getPosts.length === 0) return res.send({ msg: '존재하는 게시글이 없습니다.' });
    res.send({ posts: getPosts });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(403).send({ msg: `${err.message}` });
  }
};

// 포스트 작성
const writePosts = async (req, res) => {
  const userId = req.user.id;

  try {
    const findUser = await User.findByPk(userId);

    // find 결과가 null일 경우
    if (!findUser) return res.send({ msg: '해당 유저 정보가 존재하지 않습니다.' });

    const { title, content } = req.body;
    await Post.create({ title, content, userId });

    res.json({ msg: '게시글 작성 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 수정페이지에서 수정완료(올리기) 클릭
const editPosts = async (req, res) => {
  const postId = req.params.postId;
  const { title, content } = req.body;

  try {
    const findPost = await Post.findByPk(postId);

    // find 결과가 null일 경우
    if (!findPost) return res.status(404).send({ msg: '해당 게시글이 존재하지 않습니다.' });

    // 수정일자 업데이트
    const update = { title, content };
    await Post.update(update, { where: { id: postId } });

    res.status(200).send({ msg: '게시글 수정 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 포스트 삭제하기
const deletePosts = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const findPost = await Post.findByPk(postId);

    // find 결과가 null일 경우
    if (!findPost) return res.send({ msg: '해당 게시글이 존재하지 않습니다.' });

    // 포스트 삭제
    await Post.destroy({ where: { id: postId } });

    res.status(200).send({ msg: `게시글 삭제 완료 (${postId})` });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

module.exports = {
  getPosts,
  writePosts,
  editPosts,
  deletePosts,
};
