const express = require('express');
const router = express.Router();

const catchAsync = require('../errors/asyncError')
const appError = require('../errors/errorClass')
const {campSchema} = require('../joiSchema')

const camps = require('../controllers/camp')

// MIDDLEWARE
const { isLoggedIn, validateCamp, isAuthor } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary'); // node will automatically finds index.js file in cloudinary
const { validate } = require('../models/review');
const upload = multer({ storage })



router.route('/')
    .get( catchAsync(camps.index))
    .post( isLoggedIn, upload.array('img'), validateCamp,  catchAsync( camps.createCamp ))
    
router.get('/home', catchAsync(camps.home))
router.get('/create', isLoggedIn, camps.newCampform)

router.route('/:id')
    .get( catchAsync( camps.showCamp ))
    .put( isLoggedIn, isAuthor, upload.array('img'), validateCamp, catchAsync(camps.updateCamp))
    .delete( isLoggedIn, isAuthor, catchAsync(camps.deleteCamp))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( camps.editCamp ))
  




module.exports = router; 