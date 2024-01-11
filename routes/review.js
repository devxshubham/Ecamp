const express = require('express');
const router = express.Router({ mergeParams: true });

const Camp = require('../models/camp');
const Review = require('../models/review')

const catchAsync = require('../errors/asyncError')
const appError = require('../errors/errorClass')

const reviews = require('../controllers/review')


const { validateReviews, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReviews, catchAsync( reviews.createReview ))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync( reviews.deleteReview ))


module.exports = router ;