const createError = require("http-errors")
const express = require("express")
const session = require("express-session")
    // const logger = require("morgan")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const favicon = require("serve-favicon")
const path = require("path")

const indexRoute = require("./routes/index")
const userRoute = require("./routes/user")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const sessionMiddleware = require("./src/middlewares/session.middleware")
const apiUserRoute = require("./routes/api/user")
const apiCartRoute = require("./routes/api/cart")
const commentRoute = require("./routes/comment")
const flash = require('connect-flash');
const app = express()
const MongoDBStore = require('connect-mongodb-session')(session);

require('./src/config/passport')(passport);
app.use(favicon(path.join(__dirname, '/src/public', 'favicon.ico')))

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(flash());
app.use(express.static(path.join(__dirname, '/src/public')));
app.use(session({
    secret: 'super-mega-hyper-secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({ uri: process.env.MONGO_URL, collection: 'sessions' }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(sessionMiddleware)
app.use("/",
    (req, res, next) => {
        // console.log(req.session)
        // res.setHeader('Last-Modified', (new Date()).toUTCString());
        next()
    },
    indexRoute)

app.use("/user", userRoute)
app.use("/products", productRoute)
app.use("/cart", cartRoute)
app.use("/api/user", apiUserRoute)
app.use("/api/cart", apiCartRoute)
app.use("/comment", commentRoute)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message

    // set locals, only providing error in development
    res.locals.error = req.app.get('env') === "development" ? err : {}
    res.status(err.status || 500)

    // render the error page

    res.render('error')
})

module.exports = app