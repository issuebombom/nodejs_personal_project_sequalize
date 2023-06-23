'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // 유저 모델과 포스트 모델 간 1대 다 관계 설정
      this.hasMany(models.Post, {
        sourceKey: 'id',
        foreignKey: 'userId',
      });

      this.hasMany(models.Comment, {
        sourceKey: 'id',
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 20],
            msg: '닉네임을 최소 3자 이상 입력해 주세요.',
          },
          is: {
            args: /^[a-zA-Z0-9]+$/,
            msg: '닉네임은 영문 대소문자, 숫자만 입력해 주세요.',
          },
        },
      },
      password: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: {
            args: [4, 20],
            msg: '비밀번호는 최소 4자 이상 입력해 주세요.',
          },
          is: {
            args: /^[a-zA-Z0-9!@#$%^&*()]+$/,
            msg: '비밀번호는 영문 대소문자, 숫자, 특수기호만 입력해 주세요.',
          },
        },
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'user',
      },
      refreshToken: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.beforeCreate(async (user) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    console.log(hashedPassword)
    user.password = hashedPassword;
  });
  return User;
};
