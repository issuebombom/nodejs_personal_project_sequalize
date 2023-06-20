'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // foreign key 제약 조건 설정
    await queryInterface.addConstraint('Comments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_comments_user_id',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
    });

    await queryInterface.addConstraint('Comments', {
      fields: ['postId'],
      type: 'foreign key',
      name: 'fk_comments_post_id',
      references: {
        table: 'Posts',
        field: 'id',
      },
      onDelete: 'cascade',
    });

    await queryInterface.addIndex('Comments', ['userId', 'postId'], {
      name: 'idx_comments_post_id_user_id',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Comments', 'fk_comments_user_id');
    await queryInterface.removeConstraint('Comments', 'fk_comments_post_id');
    await queryInterface.removeIndex('Comments', 'idx_comments_post_id_user_id');
    await queryInterface.dropTable('Comments');
  },
};
