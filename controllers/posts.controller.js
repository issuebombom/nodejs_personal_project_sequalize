const Post = require('../schemas/post');
const User = require('../schemas/user');

// 전체 포스트 확인(공개)
const getPosts = async (req, res) => {
  try {
    const getPosts = await Post.find({})
      .select('-password')
      .populate({
        path: 'user',
        select: '-password -refreshToken -createdAt -updatedAt',
      })
      .sort({ _id: -1 });

    if (getPosts.length === 0) return res.send({ msg: '존재하는 게시글이 없습니다.' });
    res.send({ posts: getPosts });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(403).send({ msg: `${err.message}` });
  }
};

// 포스트 작성
const writePosts = async (req, res) => {
  const { _id } = req.user;

  try {
    const findUser = await User.findById(_id);

    // find 결과가 null일 경우
    if (!findUser) return res.send({ msg: '유저 정보가 없습니다.' });

    const { title, password, content } = req.body;
    const createdPost = await Post.create({ title, password, content, user: findUser._id });

    // 유저 정보에 유저가 올린 포스팅 정보를 담는다.
    const update = { $push: { posts: createdPost._id } };
    await User.updateOne({ _id: findUser._id }, update);
    res.json({ msg: '게시글 작성 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 수정페이지에서 수정완료(올리기) 클릭
const editPosts = async (req, res) => {
  const postId = req.params.postId;
  const { title, password, content } = req.body;

  try {
    const findPost = await Post.findById(postId);

    // find 결과가 null일 경우
    if (!findPost) return res.send({ msg: `데이터를 찾지 못했습니다.` });

    // 수정일자 업데이트
    const update = { $set: { title, password, content, updatedAt: Date.now() } };
    await Post.updateOne(findPost, update);

    res.status(200).send({ msg: '게시글 수정 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 포스트 삭제하기
const deletePosts = async (req, res) => {
  const _id = req.user._id;
  const postId = req.params.postId;

  try {
    const findUser = await User.findById(_id);
    const findPost = await Post.findById(postId);

    // find 결과가 null일 경우
    if (!findUser || !findPost) return res.send({ msg: '유저 정보 또는 게시글이 없습니다.' });

    // 유저 데이터에서 해당 포스트 id 제거 및 updatedAt 최신화
    const update = {
      $pull: { posts: postId },
      $set: { updatedAt: Date.now() },
    };
    await User.updateOne(findUser, update);

    // 포스트 삭제
    await Post.deleteOne(findPost);

    res.status(200).send({ msg: `게시글 삭제 완료 (${findPost._id})` });
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
