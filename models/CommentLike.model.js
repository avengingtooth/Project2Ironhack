const { Schema, model } = require("mongoose");

const commentLikeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            required: true,
        }
    }, {
        timestamps: true,
    });

const CommentLike = model('CommentLike', commentLikeSchema);

module.exports = CommentLike;