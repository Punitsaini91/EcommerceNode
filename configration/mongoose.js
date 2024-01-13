const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
const db =mongoose.connection;
db.on('error',console.error.bind(console,"Error connecting to mongodb"));
db.once('open',()=>{
    console.log("Connected to MongoDB");
    });




module.exports = db;
