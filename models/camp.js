const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})
const campSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: [imageSchema],
    price: {
        type: Number,
        required: true
    },
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author : {
        type : Schema.Types.ObjectId,
        ref  : 'User'
    }
});

campSchema.post('findOneAndDelete', async function (camp) {
    if(camp){
        await Review.deleteMany({ 
            _id : {
                $in : camp.reviews
            }
        })
    }
})

module.exports = mongoose.model('Camp', campSchema)

