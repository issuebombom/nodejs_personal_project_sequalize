const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9!@#$%^&*()]+$/,
      minlength: 4,
      maxlength: 20,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
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

module.exports = mongoose.model('Comment', commentSchema);
