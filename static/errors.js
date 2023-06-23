class ErrorMessage {
  constructor(status, msg) {
    this.status = status;
    this.msg = msg;
  }
}

const errors = {
  noUser: new ErrorMessage(404, '해당 유저 정보가 존재하지 않습니다.'),
  noPost: new ErrorMessage(404, '해당 게시글이 존재하지 않습니다.'),
  noComment: new ErrorMessage(404, '해당 댓글이 존재하지 않습니다.'),

  notUser: new ErrorMessage(401, '회원이 아닙니다.'),
  passwordWrong: new ErrorMessage(401, '패스워드가 틀렸습니다.'),
  existUser: new ErrorMessage(412, '해당 아이디가 이미 존재합니다.'),
  passwordDiff: new ErrorMessage(412, '패스워드와 패스워드 확인이 일치하지 않습니다.'),
  nameInPassword: new ErrorMessage(412, '닉네임 정보를 비밀번호에 적용할 수 없습니다.'),

  noCookie: new ErrorMessage(403, '엑세스 토큰 검증을 위한 쿠키 없음 (재 로그인 필요)'),
  expiredRefresh: new ErrorMessage(403, '리프레시 토큰이 만료됨 (재 로그인 필요)'),
  cantChangePost: new ErrorMessage(403, '해당 게시글의 수정 권한이 없습니다.'),
  cantChangeComment: new ErrorMessage(403, '해당 댓글의 수정 권한이 없습니다.'),
};

module.exports = errors;
