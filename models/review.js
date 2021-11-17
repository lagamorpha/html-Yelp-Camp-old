// Variable Block
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema Declaration
const reviewSchema = new Schema({
    body: String,
    rating: Number,
});

// Export Statement
module.exports = mongoose.model('Review', reviewSchema);