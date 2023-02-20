// Set up environment
require("dotenv").config();

// ℹ️ Connects to the database
const mongoose = require("../db");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Tag = require('../models/Tag.model');
const Post = require('../models/Post.model');
const PostLike = require('../models/PostLike.model');
const Follow = require("../models/Follow.model");
const Comment = require('../models/Comment.model');
const CommentLike = require('../models/CommentLike.model');

const users = [
    {
        username: 'commander_vimes',
        firstName: 'Samuel',
        lastName: 'Vimes',
        email: 'vimes@citywatch.gov',
        password: 'qwertyu',
        profilePictureURL: 'https://www.writeups.org/wp-content/uploads/Sam-Vimes-Discworld-Duke-b.jpg',
    },
    {
        username: 'carrot',
        firstName: 'Carrot',
        lastName: 'Ironfoundersson',
        email: 'captaincarrot@citywatch.gov',
        password: '123456',
        profilePictureURL: 'https://static.wikia.nocookie.net/discworld/images/0/04/Carrot-Ironfoundersson-1.jpg/revision/latest?cb=20190228222706',
    }, {
        username: 'patrician',
        firstName: 'Havelock',
        lastName: 'Vetinari',
        email: 'patrician@ankh-morpork.com',
        password: 'lajdghengdoe83jas@#$seda!@#ad',
        profilePictureURL: 'https://upload.wikimedia.org/wikipedia/en/6/6d/Lord_Vetinari.jpg',
    }, 
    {
        username: 'granny',
        firstName: 'Esme',
        lastName: 'Weatherwax',
        email: 'grannyweatherwax@lancre.dw',
        password: 'password',
        profilePictureURL: 'https://static.wikia.nocookie.net/discworld/images/2/27/Granny_Weatherwax.jpg/revision/latest?cb=20080703180147',
    },
    {
        username: 'nannyogg',
        firstName: 'Gytha',
        lastName: 'Ogg',
        email: 'nannyogg@lancre.dw',
        password: 'Hedgehog',
        profilePictureURL: 'https://static.wikia.nocookie.net/discworld/images/8/80/Nanny_Ogg.jpg/revision/latest/scale-to-width-down/250?cb=20080703180032',
    },
    {
        username: 'mottschi',
        firstName: 'Sebastian',
        lastName: 'Mottschall',
        email: 'basti@ironhack.com',
        password: '123456',
        profilePictureURL: 'https://i.imgur.com/0fF0OyU.jpg',
    },
    {
        username: 'emma',
        firstName: 'Emmanuelle',
        lastName: 'Sellin',
        email: 'emma@ironhack.com',
        password: '123456',
        profilePictureURL: '',
    },
]



const posts = [

]

const userIds = new Map();

async function seed() {
    // Drop previous data
    // await Promise.All([User.deleteMany(),
    //     Post.deleteMany(),
    //     PostLike.deleteMany(),
    //     Tag.deleteMany(),
    //     Follow.deleteMany(),
    //     Comment.deleteMany(),
    //     CommentLike.deleteMany(),]
    // )
    await User.deleteMany();
    for (const user of users) {
        const password = user.password;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        const generatedUser = await User.create(user);
        userIds.set(generatedUser.username, generatedUser.id); // NOTE .id or ._id?
    }
    mongoose.connection.close();
}

seed();
