// Variable Block
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// model reference
// https://res.cloudinary.com/lagamorph/image/upload/w_300/v1633725201/YelpCamp/h9hnbkn1zc7mljitgonx.jpg


// Image Schema Declaration
const ImageSchema = new Schema ({
    url: String,
    filename: String
})

// Options declaration
const opts = { toJSON: { virtuals: true } };

// Image Schema Virtual Property
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

// Schema Declaration
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
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
}, opts);

// Campground Schema Virtual Property
CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>
    `;
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