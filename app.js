require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT||8000;
const blogRoute=require('./routes/blog')
const userRoute = require('./routes/user')
const cookieParser=require('cookie-parser')
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog=require('./models/blog')
mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB Connected"));
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))
app.set('view engine', 'ejs');

app.set('views', path.resolve('./views'));



app.get('/', async(req, res) => {
    const allBlogs=await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allBlogs
    });
})

app.use("/user", userRoute)
app.use("/blog",blogRoute)
app.listen(PORT, () => {
    console.log(`server started on port:${PORT}`);
})

