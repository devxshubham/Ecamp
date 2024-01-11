const Review = require('../models/review')
const Camp = require('../models/camp');

module.exports.createReview = async (req, res, next) => {
    const camp = await Camp.findById(req.params.id)
    const review = new Review(req.body)
    review.author = req.user._id;
    camp.reviews.push(review)
    await review.save();
    await camp.save();
    req.flash('success', 'review was added')
    res.redirect(`/camp/${camp._id}`)
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Camp.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review was deleted')
    res.redirect(`/camp/${id}`)
}