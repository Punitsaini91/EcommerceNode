// Import the User model
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require("../model/Order");
const OrderItem = require("../model/order-item");
const secretKey = process.env.SECRET_KEY;
// Define controller methods
module.exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
   
      isAdmin
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,  
      isAdmin
    });

    await newUser.save();
    res.status(201).json({
      message: 'User created successfully!',
      newUser
    });
  } catch (err) {
    res.status(500).send('Error creating user: ' + err.message);
  }
};


module.exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports.getUsers = async (req, res) => {
    const userid = req.params.id;
    try {
      const users = await User.findById(userid).select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  module.exports.registerUser = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        isAdmin
      } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare entered password with stored hashed password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Password is correct, handle successful login
      // For instance, create a session, JWT token, or any authentication mechanism here
      // Password is correct, generate JWT token
      // Password is correct, generate JWT token
      const token = jwt.sign({ 
        userId: user.id,
        isAdmin : user.isAdmin
       }, secretKey, { expiresIn: '7d' });

      // Send a response indicating successful login with user email and token
      res.status(200).json({ email: user.email, token });
    } catch (err) {
      res.status(500).send('Error logging in: ' + err.message);
    }
  };



  module.exports.getUserCount = async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.status(200).json({ userCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports.totalSales = async (req, res) => {
    try {
      const totalSales = await Order.aggregate([
        // without id it give error
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
      ]);
  
      if (!totalSales || totalSales.length === 0) {
        return res.status(400).send('The order sales cannot be generated');
      }
  
      res.send({ totalsales: totalSales[0].totalsales });
    } catch (err) {
      res.status(500).send('Error fetching total sales: ' + err.message);
    }
  };
  module.exports.totalOrder =  async (req, res) =>{
    const orderCount = await Order.countDocuments();

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
}
module.exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    console.log(req.params)
    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const orderItemsToDelete = deletedOrder.orderItems;

    // Delete the associated order items
    await OrderItem.deleteMany({ _id: { $in: orderItemsToDelete } });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).send('Error deleting order: ' + err.message);
  }
};

module.exports.updatedOrder = async (req, res) => {
  const { status } = req.body;
  try {
    const orderId = req.params.orderId;
    console.log(orderId)
    // Check if the category exists by ID

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).send("Error updating product: " + err.message);
  }
};