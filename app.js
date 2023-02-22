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

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "iron-social";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const exposeUsertoView = require("./middleware/exposeUserToView");
app.use(exposeUsertoView)

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

app.use('/profile', require('./routes/profile.routes'));

app.use('/posts', require('./routes/posts.routes'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
