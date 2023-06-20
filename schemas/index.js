const mongoose = require('mongoose');

const connect = (() => {
  mongoose
    .connect('mongodb://localhost:27017/issuebombom_post') // 자동 데이터 베이스 생성 됨을 확인
    .catch((err) => console.error(err.name, ':', err.message));
})();

// mongoDB 연결에 대한 이벤트 리스너
mongoose.connection.on('connected', () => {
  console.log('mongoDB connected');
});
mongoose.connection.on('error', (err) => {
  console.error('connection error', err);
});

module.exports = connect;
