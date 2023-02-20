const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100, // TODO: Consider which value we want here, if any
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        tags: [{
            type: Schema.Types.ObjectId,
            ref: 'Tag',
            required: true,
        }]
    }, {
        timestamps: true,
    });

const Post = model('Post', postSchema);

module.exports = Post;