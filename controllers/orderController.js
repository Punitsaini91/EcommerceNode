const Order = require("../model/Order");
const OrderItem = require("../model/order-item");

module.exports.createOrder = async (req, res) => {
    try {
      const orderItemsIds = await Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product
        });
  
        newOrderItem = await newOrderItem.save();
  
        return newOrderItem._id;
      }));
  
      const orderItems = await OrderItem.find({ _id: { $in: orderItemsIds } }).populate('product');
  
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
        user: req.body.user,
      });
  
      const createdOrder = await order.save();
  
      if (!createdOrder) {
        return res.status(400).send('The order cannot be created!');
      }
  
      res.status(200).json(createdOrder);
    } catch (err) {
      res.status(500).send('Error creating order: ' + err.message);
    }
  };
  


module.exports.getAllOrder = async (req, res) => {
    try {
      let orders;
        orders = await Order.find({ }).populate("user",'name').sort({'dateOrdered': -1});
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).send('Error fetching products: ' + err.message);
    }
  };


  module.exports.getOrderByID = async (req, res) => {
    try {
      let orders;
        orders = await Order.findById(req.params.id)
        .populate("user",'name')
        .populate({path:'orderItems',populate:{path:"product",populate:"category"}}); 
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).send('Error fetching products: ' + err.message);
    }
  };



  module.exports.updatedOrder = async (req, res) => {
    const {
       status
    } = req.body;
    try {
      const orderId = req.params.id;
      // Check if the category exists by ID
 
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          status
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



  module.exports.deleteOrder = async (req, res) => {
    try {
      const orderId = req.params.id;
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
  