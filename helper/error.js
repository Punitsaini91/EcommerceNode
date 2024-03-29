function errorHandler(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ message: "The user is not authorized" });
    }
  
    if (err.name === "ValidationError") {
      return res.status(422).json({ message: err.message });
    }
  
    // For other types of errors, you can handle them generically
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
  module.exports = errorHandler;
  