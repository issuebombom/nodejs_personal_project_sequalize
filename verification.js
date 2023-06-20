const jwt = require('jsonwebtoken');
const User = require('./schemas/user');
const Post = require('./schemas/post');
const Comment = require('./schemas/comment');

// 엑세스 토큰 생성기
const getAccessToken = ((username, _id) => {
  const accessToken = (username, _id) =>
    jwt.sign({ username, _id }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '10s',
    });
  return (username, _id) => accessToken(username, _id);
})();

// 리프레시 토큰 생성기
const getRefreshToken = ((username, _id) => {
  const refreshToken = (username, _id) =>
    jwt.sign({ username, _id }, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: '1d',
    });
  return (username, _id) => refreshToken(username, _id);
})();

// 엑세스 토큰 검증을 위한 미들웨어
function verifyAccessToken(req, res, next) {
  // 쿠키에서 access token을 획득합니다.
  const cookies = req.cookies;

  // 쿠키가 없는 경우
  if (!cookies?.issuebombomCookie)
    return res.status(403).send({ msg: '엑세스 토큰 검증을 위한 쿠키 없음 (재 로그인 필요)' });

  // access token 검증
  const accessToken = cookies.issuebombomCookie;
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err) => {
    // access token이 만료된 경우 다음 미들웨어에 expired 전달
    if (err) {
      req.expired = true;
      console.error(err.name, ':', err.message);
    }
    // req.user = user; // 토큰이 만료될 경우 user는 undefined가 된다.
    req.user = jwt.decode(accessToken); // 페이로드 전달
    next();
  });
}

// 엑세스 토큰 만료 시 재발급을 위한 미들웨어
async function replaceAccessToken(req, res, next) {
  if (req.expired) {
    try {
      // DB에 저장된 리프레시 토큰 확인
      const findUser = await User.findById({ _id: req.user._id });

      // 토큰 검증
      const refreshToken = findUser.refreshToken;
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err) => {
        // refresh token이 만료된 경우 재로그인 안내
        if (err) return res.status(403).send({ msg: '리프레시 토큰이 만료됨 (재 로그인 필요)' });
      });
      // 토큰 재발급 및 쿠키로 보냄
      res.cookie('issuebombomCookie', getAccessToken(findUser.username, findUser._id), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24시간
      });
      console.log('엑세스 토큰 만료로 재발급 진행');
    } catch (err) {
      console.error(err.name, ':', err.message);
      return res.status(500).send({ msg: `${err.message}` });
    }
  }
  next();
}

// 게시글 수정 권한 검증을 위한 미들웨어
async function verificationForPosts(req, res, next) {
  const postId = req.params.postId;
  const password = req.body.password; // form 태그에서 받음
  const userId = req.user._id; // 미들웨어 토큰에서 가져온 정보

  try {
    const findPost = await Post.findById(postId);
    const findUser = await User.findById(userId);

    if (!findPost) return res.status(404).send({ msg: '존재하는 게시글이 없습니다.' });

    if (!findUser.posts.includes(postId))
      return res.status(403).send({ msg: '해당 게시글의 수정 권한이 없습니다.' });

    // 패스워드 일치 유무 확인
    if (password !== findPost.password)
      return res.status(403).send({ msg: '비밀번호가 일치하지 않습니다.' });
    next();
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
}

// 댓글 수정 권한 검증을 위한 미들웨어
async function verificationForComments(req, res, next) {
  const { postId, commentId } = req.params;
  const password = req.body.password; // form태그에서 받음
  const userId = req.user._id; // 미들웨어 토큰에서 가져온 정보

  try {
    const findPost = await Post.findById(postId);
    const findComment = await Comment.findById(commentId);
    const findUser = await User.findById(userId);

    if (!findPost || !findComment)
      return res.status(404).send({ msg: '게시글 또는 댓글이 없습니다.' });

    if (!findUser.comments.includes(commentId))
      return res.status(403).send({ msg: '해당 댓글의 수정 권한이 없습니다.' });

    // 패스워드 일치 유무 확인
    if (password !== findComment.password)
      return res.status(403).send({ msg: '비밀번호가 일치하지 않습니다.' });
    next();
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
}

module.exports = {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  replaceAccessToken,
  verificationForPosts,
  verificationForComments,
};
