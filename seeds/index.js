// Variable Block
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Server Settings
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected!');
});

// Seed Data Compiler
const seedDB = async () => {
    // Clear Old Data
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61498cfadfad6d07c443581c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima quo nemo aliquam animi placeat quod fuga iure, dolorum, omnis commodi voluptas accusamus repellendus id quis necessitatibus temporibus voluptatibus asperiores assumenda.At, sapiente quam? Dignissimos recusandae aliquid quia ut tempora praesentium nam ea? Fugit animi eligendi autem neque quaerat dolor officia quidem. Et qui dolorum soluta dolorem veniam cum explicabo vel?',
            price,
            geometry: { 
              type: 'Point',
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
              ]  
            },
            images: [
              {
                url: 'https://res.cloudinary.com/lagamorph/image/upload/v1634880881/YelpCamp/bxiwqp316hd9v4edjvvm.jpg',
                filename: 'YelpCamp/bxiwqp316hd9v4edjvvm'
              },
              {
                url: 'https://res.cloudinary.com/lagamorph/image/upload/v1634880881/YelpCamp/pwj0rbaihq4igtsrqc6s.jpg',
                filename: 'YelpCamp/pwj0rbaihq4igtsrqc6s'
              },
              {
                url: 'https://res.cloudinary.com/lagamorph/image/upload/v1634880881/YelpCamp/zjms3iiixfwf58i3zvmg.jpg',
                filename: 'YelpCamp/zjms3iiixfwf58i3zvmg'
              }
            ]
        });
        // Save Files
        await camp.save();
    }
    console.log('File Saved!');
}

// Close Connection
seedDB().then(() => {
    console.log('Closing Connection!');
    mongoose.connection.close();
});