// Variable Block
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// Schema Declaration
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// Deletion Query Middleware
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
        console.log('Deletion Complete!');
    }
}) 

// Export Block
module.exports = mongoose.model('Campground', CampgroundSchema);