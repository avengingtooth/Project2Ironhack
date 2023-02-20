const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        content: {
            type: String,
            trim: true,
            required: true,
        }
    }, {
        timestamps: true,
    });

const Comment = model('Comment', commentSchema);

module.exports = Comment;