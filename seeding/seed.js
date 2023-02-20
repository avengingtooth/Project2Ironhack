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
    {
        author: 'granny',
        title: 'Witchery',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce elementum orci ac metus varius, at vestibulum tellus lobortis. Curabitur placerat magna arcu, quis bibendum mauris tempus ac. In porttitor ultricies nisi, ut laoreet felis egestas vitae. Proin at metus libero. Donec at ipsum nisi. Aenean sed mauris id enim tincidunt lobortis. Sed molestie molestie diam nec dictum. Fusce luctus imperdiet elit vitae tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus rutrum auctor quam sed scelerisque. Praesent dolor massa, tincidunt eu volutpat vitae, fermentum vitae est. Vestibulum et metus in nibh porta suscipit. Duis elementum pulvinar dolor sit amet ultricies. Sed scelerisque, augue nec molestie cursus, est magna euismod tortor, non rutrum elit turpis ultricies mauris. Curabitur quis lacus non sem pharetra consequat.',
        tags: ['witches', 'discworld'],
    },
    {
        author: 'carrot',
        title: 'Last Nights Arrests',
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
        tags: ['guard', 'ankh-morpork', 'arrests'],
    },
    {
        author: 'carrot',
        title: 'Guard Shift Schedule',
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
        tags: ['guard', 'ankh-morpork', 'shifts'],
    },
    {
        author: 'mottschi',
        title: 'Lorem Ipsum Blablabla',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras varius eget mi ac aliquet. Duis sed erat lacinia, tristique lectus nec, bibendum augue. Sed ultrices feugiat ultricies. Proin eget pulvinar tortor. Proin et arcu est. Nam dapibus accumsan erat id cursus. Aliquam erat volutpat. Nam elementum, felis faucibus aliquet auctor, nisi quam finibus eros, vitae mollis purus odio gravida augue.',
        tags: ['lorem', 'ipsum'],
    },
    {
        author: 'mottschi',
        title: 'More Lorem Ipsum Fun Facts',
        content: 'Sed congue nisi sit amet vestibulum maximus. Quisque massa lectus, porta id sollicitudin interdum, dignissim ac urna. Sed non mauris rutrum, varius enim sodales, egestas lacus. Nunc vulputate risus ac viverra finibus. Phasellus tristique dictum nibh. Aliquam eleifend dolor sit amet dignissim ultrices. Vestibulum viverra at justo sed ultricies. Suspendisse volutpat at libero a varius. Integer ligula urna, aliquet id volutpat ac, feugiat sed nulla. Donec congue lectus mauris, quis tincidunt quam pulvinar sed. Mauris lacus metus, gravida in vulputate nec, convallis vel neque. Nunc condimentum finibus ornare. Proin vitae sollicitudin risus, quis aliquet lectus. Phasellus lacus velit, porta eu porta et, aliquet et enim. Donec sodales mollis ligula quis tincidunt. ',
        tags: ['lorem', 'ipsum'],
    },
    {
        author: 'emma',
        title: 'To be updated',
        content: 'Fun random stuff here',
        tags: ['random']
    }
]

const userMap = new Map();
const tagMap = new Map();

async function seed() {
    // Drop previous data
    await Promise.all([User.deleteMany(),
        Post.deleteMany(),
        PostLike.deleteMany(),
        Tag.deleteMany(),
        Follow.deleteMany(),
        Comment.deleteMany(),
        CommentLike.deleteMany(),]
    )

    for (const user of users) {
        const password = user.password;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        const generatedUser = await User.create(user);
        userMap.set(generatedUser.username, generatedUser);
    }

    for (const post of posts) {
        const user = userMap.get(post.author);
        const tags = [];
        console.log('looking at tags')
        for (const tag of post.tags) {
            let currentTag;
            if (currentTag = tagMap.get(tag)) {
                console.log('tag already exists', tag, currentTag)
            } else {
                console.log('about to create tag', tag)
                currentTag = await Tag.create({name: tag});
                tagMap.set(tag, currentTag);
                console.log('new tag created for', tag, currentTag)
            }
            tags.push(currentTag);
        }
        post.author = user;
        post.tags = tags;
        const newPost = await Post.create(post);
        console.log(newPost);
    }


    mongoose.connection.close();
}

seed();
