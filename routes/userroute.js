const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define user routes
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/count', userController.getUserCount);
router.get('/users/:id', userController.getUsers);
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);

// handle orderhere
router.get("/users/orders/total-sales", userController.totalSales);
router.get('/users/:customerId/orders', userController.totalOrder);
router.put('/users/:customerId/orders/:orderId', userController.updatedOrder);
router.delete('/users/:customerId/orders/:orderId', userController.deleteOrder);

// chat handel here
router.get('/users/sendMessage/:userId', (req, res) => {
    res.render('user', { userId: req.params.userId }); // Render user chat interface
  });



module.exports = router;