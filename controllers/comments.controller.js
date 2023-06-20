const Post = require('../schemas/post');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

// 포스트 댓글 확인(공개)
const getComments = async (req, res) => {
  const postId = req.params.postId;

  // 해당 포스트의 댓글과 각 댓글의 유저 정보 가져오기
  try {
    const post = await Post.findById(postId).populate({
      path: 'comments',
      populate: { path: 'user', model: 'User', select: '-password -refreshToken -createdAt -updatedAt' }, // 유저 패스워드 노출에 대한 조치 필요
      options: { sort: { _id: -1 }, select: '-password' }, // 코멘트 id 기준으로 내림차순 정렬
    });

    if (!post) return res.status(404).send({ msg: '해당 포스터가 존재하지 않습니다.' });
    if (post.comments.length === 0)
      return res.status(404).send({ msg: '해당 포스터의 댓글이 존재하지 않습니다.' });
    res.send({ comments: post.comments });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 포스트 댓글 작성(회원 전용)
const writeComments = async (req, res) => {
  const { _id } = req.user;
  const postId = req.params.postId;

  try {
    const findUser = await User.findById(_id);
    const findPost = await Post.findById(postId);
    const { password, content } = req.body;

    if (!findUser || !findPost) return res.send({ msg: '유저정보 또는 게시글이 없습니다.' });

    const createdComment = await Comment.create({
      password,
      content,
      user: findUser._id,
      post: postId,
    });

    // 유저 컬렉션과 포스트 컬렉션에 댓글 id 등록하기
    const update = { $push: { comments: createdComment._id } };
    await User.updateOne(findUser, update);
    await Post.updateOne(findPost, update);
    res.json({ msg: '댓글 작성 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 수정페이지에서 수정완료(올리기) 클릭
const editComments = async (req, res) => {
  const commentId = req.params.commentId;
  const { password, content } = req.body;

  try {
    const findComment = await Comment.findById(commentId);

    if (!findComment) return res.send({ msg: `댓글을 찾지 못했습니다.` });

    // 수정일자 업데이트
    const update = { $set: { password, content, updatedAt: Date.now() } };
    await Comment.updateOne(findComment, update);
    res.status(200).send({ msg: '댓글 수정 완료' });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

// 댓글 삭제하기
const deleteComments = async (req, res) => {
  const _id = req.user._id;
  const { postId, commentId } = req.params;

  try {
    const findUser = await User.findById(_id);
    const findPost = await Post.findById(postId);
    const findComment = await Comment.findById(commentId);

    if (!findUser || !findPost || !findComment)
      return res.send({ msg: `유저 정보 또는 게시글 또는 댓글 정보를 찾지 못했습니다.` });

    // 유저 및 포스트 데이터에서 해당 댓글 id 제거 및 updatedAt 최신화
    const update = {
      $pull: { comments: commentId },
      $set: { updatedAt: Date.now() },
    };
    await Post.updateOne(findPost, update);
    await User.updateOne(findUser, update);

    // 댓글 삭제
    await Comment.deleteOne(findComment);
    res.status(200).send({ msg: `댓글 삭제 완료 (${findComment._id})` });
  } catch (err) {
    console.error(err.name, ':', err.message);
    return res.status(500).send({ msg: `${err.message}` });
  }
};

module.exports = {
  getComments,
  writeComments,
  editComments,
  deleteComments,
};
