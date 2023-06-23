const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { getAccessToken, getRefreshToken } = require('../static/verification'); // 토큰 생성기
const errors = require('../static/errors');

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // 데이터베이스에서 유저 정보 조회
    const findUser = await User.findOne({ where: { username } });
    console.log(findUser.password)
    if (!findUser) return res.status(errors.notUser.status).send({ msg: errors.notUser.msg });

    // 암호 확인
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid)
      return res.status(errors.passwordWrong.status).send({ msg: errors.passwordWrong.msg });

    // 엑세스 토큰을 쿠키로 보냄
    res.cookie('issuebombomCookie', getAccessToken(username, findUser.id), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    });

    // 리프레시 토큰을 데이터베이스에 저장
    const update = { refreshToken: getRefreshToken(username, findUser.id) };
    await User.update(update, { where: { id: findUser.id } });

    res.status(200).send({ msg: '로그인 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(400).send({ msg: `${err.message}` });
  }
};

module.exports = {
  login,
};
