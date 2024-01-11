const mongoose = require('mongoose');
const Camp = require('../models/camp');
const cities = require('./cities');
const {first, last} = require('./names');
const camp = require('../models/camp');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('SUCCEFULLY CONNECTED TO MONGODB')
    })
    .catch(err => {
        console.log('CONNECTION FAILED WITH MONGO')
        console.log(err)
    });
    
const create = (array) =>  array[Math.floor(Math.random()*array.length)];
  
 
const seedDb = async () => {
    await Camp.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000 );
        const camp = new Camp({
            name : `${create(first)} ${create(last)}`,
            author: '64b629c1d78e8402e4eba2a2',
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            img: "https://picsum.photos/200",
            price : random1000+500 ,
            
        })
        await camp.save();
        const now = await Camp.find({})
       console.log(now)
    }
}   
seedDb();