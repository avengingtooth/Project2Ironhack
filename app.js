// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

hbs.registerPartials('views/partials')
hbs.registerHelper('ifUserIsPostAuthor', (user, post, options) => {
    if (post.author._id.equals(user._id)) return options.fn(post);
    return options.inverse(post);
});

hbs.registerHelper('ifArrayIncludesId', (array, id, options) => {
    if (array.some((elem) => elem.equals(id))) return options.fn();
    return options.inverse();
})

hbs.registerHelper('dateFormat', (date, options) => {
    // const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    if (hour < 10) hour = '0' + hour;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
})

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "iron-social";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// loading custom middleware that should be used on all routes
const exposeUsertoView = require("./middleware/exposeUserToView");
app.use(exposeUsertoView);

const initializePublicJsScripts = require('./middleware/initializePublicJsScripts');
app.use(initializePublicJsScripts);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
 
const profileRoutes = require("./routes/profile.routes");
app.use("/profile", profileRoutes)

const postsRoutes = require("./routes/posts.routes.js");
app.use("/posts", postsRoutes)

const apiRoutes = require("./routes/api.routes.js");
app.use("/api", apiRoutes)

const searchRoutes = require("./routes/search.routes.js")
app.use('/search', searchRoutes)

app.use('/profile', require('./routes/profile.routes'));

app.use('/posts', require('./routes/posts.routes'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
