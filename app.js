if( process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
// console.log(process.env.secret)

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const appError = require('./errors/errorClass');

const passport = require('passport');
const localStrategy = require('passport-local');

const User = require('./models/user')



//  express routes
const campRoutes = require('./routes/camp');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');


mongoose.connect(`mongodb://localhost:${process.env.MONGOURL}/todoapp`)
    .then(() => {
        console.log('SUCCEFULLY CONNECTED TO MONGODB')
    })
    .catch(err => {
        console.log('CONNECTION FAILED WITH MONGO')
        console.log(err)
    })
 
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// SESSION AND FLASH
app.use(session({
    secret : 'makethisbettersecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000*60*60*24*7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly : true, /// this is default btw
    }
}));
app.use(flash());



// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res ,next) => {
    res.locals.currentUser = req.user ;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next(); 
})
 
app.use('/camp', campRoutes);
app.use('/camp/:id/reviews', reviewRoutes);
app.use('/', userRoutes)




// app.all('*', (req, res) => {
//     throw new appError(404, 'PAGE NOT FOUND');
// }) 

//  ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    const {status = 500} = err; 
    console.log(err)
    if(!err.msg) err.msg = 'SOMETHING WENT WRONG';
    res.status(status).render('camp/error', {err})
} )


 
app.listen(4000, () => {
    console.log('LISTENING ON PORT 4000')
})