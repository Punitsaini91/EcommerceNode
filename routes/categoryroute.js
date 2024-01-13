const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/categoryController');

router.post('/categories', categoryControllers.createCategory);
router.get('/categories', categoryControllers.getAllCategories);
router.get('/categories/:id', categoryControllers.getCategoryById);
router.put('/categories/:id', categoryControllers.updateCategory); // Update category route
router.delete('/categories/:id', categoryControllers.deleteCategory); // Delete category route

module.exports = router;
