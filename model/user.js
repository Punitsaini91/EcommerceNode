const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });
  
  // Apply a transformation to include 'id' in JSON output
  userSchema.set('toJSON', { virtuals: true });
  
// Create the User model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;