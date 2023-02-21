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

commentLikeSchema.index({user: 1, comment: 1}, {unique: true});

const CommentLike = model('CommentLike', commentLikeSchema);

module.exports = CommentLike;