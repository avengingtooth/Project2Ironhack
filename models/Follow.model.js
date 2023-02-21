const { Schema, model } = require("mongoose");

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    followedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

// users cannot follow another user multiple times at the same time
followSchema.index({follower: 1, followedUser: 1}, {unique: true});

const Follow = model('Follow', followSchema);

module.exports = Follow;