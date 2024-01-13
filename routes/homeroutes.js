const express = require('express');
const { homeControllers } = require('../controllers/homeController');
const router = express.Router();

router.get("/",homeControllers);
module.exports = router;
