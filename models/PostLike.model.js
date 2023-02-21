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

// each user can have only one active like on a post
postLikeSchema.index({user: 1, post: 1}, {unique: true});

const PostLike = model('PostLike', postLikeSchema);



module.exports = PostLike;