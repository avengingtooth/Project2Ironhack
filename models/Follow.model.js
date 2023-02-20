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

const Follow = model('Follow', followSchema);

module.exports = Follow;