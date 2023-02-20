const { Schema, model } = require("mongoose");

const postLikeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        }
    }, {
        timestamps: true,
    });

const PostLike = model('PostLike', postLikeSchema);

module.exports = PostLike;