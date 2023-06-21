const { User, Post } = require('../models');

// 유저 조회(API 확인용)
const getUsers = async (req, res) => {
  try {
    const findUsers = await User.findAll({
      attributes: {
        exclude: ['password', 'refreshToken'],
      },
    });
    if (findUsers.length === 0)
      return res.status(404).send({ msg: '해당 유저 정보가 존재하지 않습니다.' });

    res.send(findUsers);
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 유저 조회(개인별)
const getUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const findUser = await User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'refreshToken'],
      },
    });
    if (!findUser) return res.send({ msg: '해당 유저 정보가 존재하지 않습니다.' });

    res.send({ users: findUser });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 유저별 포스트 확인
const getPostsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const findUser = await User.findByPk(userId);
    const findPost = await Post.findAll({ where: { userId } });

    if (!findUser) return res.send({ msg: '해당 유저 정보가 존재하지 않습니다.' });
    if (findPost.length === 0) return res.send({ msg: '해당 유저는 작성한 포스트가 없습니다.' });

    res.send({ posts: findPost });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// sign-up
const signUp = async (req, res) => {
  const { username, password, passwordConfirm } = req.body;

  try {
    const findUser = await User.findOne({
      where: { username },
    });

    // 고유값에 대한 검증을 합니다.
    if (findUser) return res.status(412).send({ msg: '해당 아이디가 이미 존재합니다.' });

    // 패스워드와 패스워드 확인이 일치하는지 검증
    if (password !== passwordConfirm)
      return res.status(412).send({ msg: '패스워드와 패스워드 확인이 일치하지 않습니다.' });

    // 닉네임 패턴 비밀번호 적용 유무를 검증
    const re = new RegExp(username, 'i');
    if (re.test(password))
      return res.status(412).send({ msg: ' 닉네임 패턴을 비밀번호에 적용할 수 없습니다.' });

    // 계정 생성
    await User.create({ username, password });
    res.send({ msg: '유저 등록 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

module.exports = {
  getUsers,
  getUser,
  getPostsByUser,
  signUp,
};
