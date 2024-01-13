const express = require('express');
const router = express.Router();

const homeRoutes = require('./homeroutes');
const categoryRoutes = require('./categoryroute');
const productRoutes = require('./productroute');
const userRoute = require('./userroute')
const OrderRoute = require('./orderRoute')
const customerRoutes = require('./customerRoute')
router.use('/', homeRoutes);
router.use('/', categoryRoutes);
router.use('/', productRoutes);
router.use('/',userRoute)
router.use('/',OrderRoute)
router.use('/customers', customerRoutes);

module.exports = router;