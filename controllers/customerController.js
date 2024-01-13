const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../model/Customer");
const Order = require("../model/Order");
const OrderItem = require("../model/order-item");
const secretKey = process.env.SECRET_KEY;

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const {      
      name,
      email,
      password,
      isAdmin} = req.body;
    console.log(req.body);

    // Check if the customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).send("Customer already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer with isAdmin set to false by default
    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
      isAdmin
    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer created successfully!",
      newCustomer: newCustomer,
    });
  } catch (err) {
    res.status(500).send("Error creating customer: " + err.message);
  }
};

// Customer login
exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).send("Invalid email or password");
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compareSync(password, customer.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Create and send a JWT token for authentication
    const token = jwt.sign(
      { customerId: customer._id, isAdmin: customer.isAdmin },
      secretKey, // Replace with your own secret key
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token: token,
    });
  } catch (err) {
    res.status(500).send("Login failed: " + err.message);
  }
};
module.exports.createOrder = async (req, res) => {
  try {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      })
    );

    const orderItems = await OrderItem.find({
      _id: { $in: orderItemsIds },
    }).populate("product");

    let totalPrices = 0;

    orderItems.forEach((orderItem) => {
      if (orderItem.product && orderItem.product.price) {
        totalPrices += orderItem.product.price * orderItem.quantity;
      }
    });

    const order = new Order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrices,
      customer: req.body.customer,
    });

    const createdOrder = await order.save();

    if (!createdOrder) {
      return res.status(400).send("The order cannot be created!");
    }

    res.status(200).json(createdOrder);
  } catch (err) {
    res.status(500).send("Error creating order: " + err.message);
  }
};

// Get all orders of a customer
module.exports.getAllOrderById = async (req, res) => {
  try {
    let orders;
    orders = await Order.find({})
      .populate("customer", "name")
      .sort({ dateOrdered: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send("Error fetching products: " + err.message);
  }
};

module.exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
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

module.exports.totalOrder =  async (req, res) =>{
  const orderCount = await Order.countDocuments();

  if(!orderCount) {
      res.status(500).json({success: false})
  } 
  res.send({
      orderCount: orderCount
  });
}

// 6577e56d18383526f48cbea9
