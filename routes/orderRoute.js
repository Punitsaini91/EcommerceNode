const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Define user routes
router.post('/orders', orderController.createOrder);
router.get("/orders", orderController.getAllOrder);
router.get("/orders/total-sales", orderController.totalSales);
router.get("/orders/count", orderController.totalOrder);
router.get("/orders/:id", orderController.getOrderByID);
router.put("/orders/:id", orderController.updatedOrder);
router.delete("/orders/:id", orderController.deleteOrder); 




module.exports = router;