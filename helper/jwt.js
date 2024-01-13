var { expressjwt: jwt } = require("express-jwt");
const User = require("../model/user");
const secretKey = process.env.SECRET_KEY;


const jwtMiddleware = jwt({
      secret: secretKey,
      algorithms: ['HS256'],
      isRevoked: isRevokedCallback, // Use the isRevoked function
    }).unless({ path: [
      // GET THE PRODUCT WITHOUT AUTHORIZTION
      {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
      {url : /products(.*)/,method:['GET' , 'OPTIONS'] },
      {url : /categories(.*)/,method:['GET' , 'OPTIONS'] },
      {url : /sendMessage(.*)/,method:['GET' , 'OPTIONS'] },
      '/users/login',
      '/users/register',
      '/customers/signup',
      '/customers/login'] }) // Define paths that don't require authentication


// Define a function to check if the user is an admin
// Log payload for debugging
// function isRevoked(req, payload, done) {
//   console.log("Received payload:", payload.payload); // Log the payload here
//   if (payload.payload.isAdmin === false) {
//     // If the payload is empty or does not contain isAdmin property, revoke access
//     return done(null, true);
//   }
//   // If the user is an admin, allow access
//   done();
// }



async function isRevokedCallback(req, token){
  if(!token.payload.isAdmin) {
     return true;
  }
}
  
  module.exports = jwtMiddleware; 