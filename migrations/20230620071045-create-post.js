'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
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
    await queryInterface.addConstraint('Posts', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_posts_user_id',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
    });

    await queryInterface.addIndex('Posts', ['userId'], {
      name: 'idx_posts_user_id',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Posts', 'fk_posts_user_id');
    await queryInterface.removeIndex('Posts', 'idx_posts_user_id');
    await queryInterface.dropTable('Posts');
  },
};
