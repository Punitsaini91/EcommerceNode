const express = require('express');
const router = express.Router();
const productController = require("../controllers/product_controller")
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
  
        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
   const uploadOptions = multer({ storage: storage })

router.post("/products",  uploadOptions.single('image'),productController.createProduct);
router.get("/products", productController.getAllProducts);
router.get("/products/feature/:count", productController.getFeaturedProducts);
// router.get("/products/count", productController.getTotalProducts); // Moved count route above the ID-specific route
router.get("/products/:id", productController.getProductById); // Moved this after the count route
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get("/products/category", productController.getAllProducts);



module.exports = router;

// AKIAQVUWFSCA7DT5Z3MH
// dpU9yHxHiyTf6MMQOvP5pQ2ua0GTim1E5qy/yqwU