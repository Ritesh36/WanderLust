if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const aiRouter = require("./routes/ai.js");

const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR", err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

main().then(() => {
    console.log("connected to server");
})
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success")[0] || "";
    res.locals.error = req.flash("error")[0] || "";
    res.locals.currUser = req.user || null;
    next();
})

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/ai-assist", aiRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
})

app.listen(process.env.PORT || 8080, () => {
    console.log("Server listening on http://localhost:8080");
})