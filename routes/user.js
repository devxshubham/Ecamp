const express = require('express');
const router = express.Router() ;
const User = require('../models/user');
const catchAsync = require('../errors/asyncError');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');

const Users = require('../controllers/user');

router.route('/register')
    .get( Users.renderRegister )
    .post( catchAsync( Users.register ))

router.route('/login')
    .get( Users.renderLogin)
    .post( passport.authenticate('local', { failureFlash:true, 
                                        failureRedirect : '/login'}), Users.login)
                                  
router.get('/logout', Users.logout )

module.exports = router