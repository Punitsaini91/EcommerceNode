const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Create a new customer
router.post('/signup', customerController.createCustomer);

// Customer login
router.get('/login', customerController.customerLogin);
// Create a new order for a customer
router.post('/:customerId/orders', customerController.createOrder);

// Get all orders of a customer
router.get('/:customerId/orders', customerController.getAllOrderById);
router.delete('/:customerId/orders/:orderId', customerController.deleteOrder);
router.get('/:customerId/orders/:orderId', customerController.totalOrder);

// chat handle here
router.get('/sendMessage/:customerId', (req, res) => {
    res.render('customer', { customerId: req.params.customerId }); // Render customer chat interface
  });



module.exports = router;
