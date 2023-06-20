const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9]+$/,
      minlength: 3,
      maxlength: 40,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9!@#$%^&*()]+$/,
      minlength: 4,
      maxlength: 20,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'guest'],
      default: 'guest',
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    refreshToken: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
