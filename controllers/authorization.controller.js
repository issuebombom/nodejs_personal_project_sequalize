const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const { getAccessToken, getRefreshToken } = require('../verification'); // 토큰 생성기

const login = async (req, res) => {
  const { username } = req.body;
  try {
    // 데이터베이스에서 유저 정보 조회
    const findUser = await User.findOne({ username });
    if (!findUser) return res.status(401).send({ msg: '회원이 아닙니다.' });

    // 엑세스 토큰을 쿠키로 보냄
    res.cookie('issuebombomCookie', getAccessToken(username, findUser._id), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    });

    // 리프레시 토큰을 데이터베이스에 저장
    const update = { $set: { refreshToken: getRefreshToken(username, findUser.id) } };
    await User.updateOne(findUser, update);

    res.status(200).send({ msg: '로그인 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

module.exports = {
  login,
};
