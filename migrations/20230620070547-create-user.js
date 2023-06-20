'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 20],
            msg: '최소 3자 이상 입력해야 합니다.',
          },
          is: {
            args: /^[a-zA-Z0-9]+$/,
            msg: 'Field must contain only letters',
          },
        },
      },
      password: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          len: {
            args: [4, 20],
            msg: '최소 4자 이상 입력해야 합니다.',
          },
          is: {
            args: /^[a-zA-Z0-9!@#$%^&*()]+$/,
            msg: 'Field must contain only letters',
          },
        },
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'user',
      },
      refreshToken: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
