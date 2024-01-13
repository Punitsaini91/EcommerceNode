const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default:" "
    },
    image: {
        type: String,
        required: true
    },
 brand:{
    type: String,
    default:" "
 },
    price: {
        type: Number,
        default:0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        // it refernce the category it used when we want to show to table data
        ref:'Category',
        required:true
    },
    countInStock: {
        type: Number,
        required: true,
        min:0,
        max:255
    },
    rating: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
