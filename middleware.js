const Camp = require('./models/camp');
const Review = require('./models/review');
const catchAsync = require('./errors/asyncError')
const appError = require('./errors/errorClass')
const { campSchema } = require('./joiSchema')
const { reviewSchema } = require('./joiSchema')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl ;                        
        req.flash('error', 'You must be signed in')
        res.redirect('/login')
    }
    else {
        next()
    }
}
module.exports.validateCamp = (req, res, next) => {
    const { error } = campSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(400, msg)
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Camp.findById(id)

    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'you are not authorized to do that');
        return res.redirect(`/camp/${id}`)
    }
    next();
}



module.exports.validateReviews = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new appError(400, msg)
    }
    else {
        next();
    }
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you are not authorized to do that');
        return res.redirect(`/camp/${id}`)
    }
    next();
}