const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima quo nemo aliquam animi placeat quod fuga iure, dolorum, omnis commodi voluptas accusamus repellendus id quis necessitatibus temporibus voluptatibus asperiores assumenda.At, sapiente quam? Dignissimos recusandae aliquid quia ut tempora praesentium nam ea? Fugit animi eligendi autem neque quaerat dolor officia quidem. Et qui dolorum soluta dolorem veniam cum explicabo vel?',
            price
        });
        await camp.save();
    }
    console.log('File Saved!');
}

seedDB().then(() => {
    console.log('Closing Connection!');
    mongoose.connection.close();
});