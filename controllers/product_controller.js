// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Category = require("../model/Category");
const Product = require("../model/product");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// module.exports.getAllProducts = async (req, res) => {
//   try {
//     // show the only image or name of the product , and -_id means exclude the id bacause it apperas by default ti remove it we use this -.
//     // const products = await Product.find().select("name image -_id");

//     //   populate maethod shows the both product and categoy data

//     const products = await Product.find().populate("category");

//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).send("Error fetching products: " + err.message);
//   }
// };


const s3Client = new S3Client({ 
  region: process.env.REGION_AWS,
  credentials : {
    accessKeyId :process.env.ACCESSKEY_AWS,
    secretAccessKey:process.env.SECRETKEY_AWS,
  }
});

async function uploadToS3(fileBuffer, file,contentType) {
  const params = {
    Bucket: 'nodeimage-punit',
    Key: `/upload/users/${file}`, // Adjust the Key as per your desired folder structure
    Body: fileBuffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  try {
    // Execute the putObject operation to upload the file to S3
    const data = await s3Client.send(command);

    // Optionally, return the uploaded object details or URL if needed
    return data;
  } catch (err) {
    throw new Error("Error uploading to S3: " + err.message);
  }

}
async function getSignedS3Url(file) {
  const params = {
    Bucket: 'nodeimage-punit',
    Key: `upload/users/${file}`, // Adjust the Key as per your desired folder structure
    ContentType: 'image/*', // Set the content type based on your file type
  };

  const command = new PutObjectCommand(params);

  try {
    // Get the signed URL for the file
    const url = await getSignedUrl(s3Client, command);
    return url; // Return the signed URL
  } catch (err) {
    throw new Error("Error getting signed URL: " + err.message);
  }
}



  

module.exports.createProduct = async (req, res) => {

  const {
    name,
    description,
    brand,
    price,
    category,
    countInStock,
    rating,
    isFeatured,
  } = req.body;
  // const image = req.file.filename;
  const image = req.file.filename;
  // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

  try {

    // const isAdmin = req.user.isAdmin; // Assuming the isAdmin property is present in the token payload
    
    // if (!isAdmin) {
    //   return res.status(403).send('Unauthorized');
    // }
    const uploadedFile = await uploadToS3(req.file.buffer, req.file.filename, req.file.mimetype);
    const imageUrl = await getSignedS3Url(req.file.filename);

    const existingCategory = await Category.findById(req.body.category);
    if (!existingCategory) {
    return res.status(400).send("Invalid Category");
  }
    const newProduct = new Product({
      name,
      description,
      // image: `${basePath}${image}`,
      image:imageUrl,
      brand,
      price,
      category,
      countInStock,
      rating,
      isFeatured,
    });

    await newProduct.save();
    res.status(201).json({
      message: "Product created successfully!",
      newProduct: newProduct,
    });
  } catch (err) {
    res.status(500).send("Error creating product: " + err.message);
  }
};
module.exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    // Find the product by ID
    //   populate maethod shows the both product and categoy data
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).send("Error fetching product: " + err.message);
  }
};



module.exports.updateProduct = async (req, res) => {
  const {
    name,
    description,
    image,
    images,
    brand,
    price,
    category,
    countInStock,
    rating,
    isFeatured,
  } = req.body;
  try {
    const productId = req.params.id;
    // Check if the category exists by ID
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).send("Category does not exist");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        image,
        images,
        brand,
        price,
        category,
        countInStock,
        rating,
        isFeatured,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).send("Error updating product: " + err.message);
  }
};


module.exports.getAllProducts = async (req, res) => {
  try {
    let products;
    const categories = req.query.categories; // Assuming categories are sent as an array of category IDs

    if (categories && categories.length > 0) {
      // Split the comma-separated string into an array of category IDs
      const categoryIds = categories.split(',');

      // If an array of category IDs is provided, filter products by those categories
      products = await Product.find({ category: { $in: categoryIds } }).populate("category");
    } else {
      // If no categories or an invalid format is provided, retrieve all products
      products = await Product.find().populate("category");
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).send('Error fetching products: ' + err.message);
  }
};




module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).send('Error deleting product: ' + err.message);
  }
};

// module.exports.getTotalProducts = async (req, res) => {
//   try {
//     const totalProducts = await Product.countDocuments();
//     res.status(200).json({ totalProducts });
//   } catch (err) {
//     res.status(500).send('Error counting products: ' + err.message);
//   }
// };






module.exports.getFeaturedProducts = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(count);
    res.status(200).json({  featuredProducts });
  } catch (err) {
    res.status(500).send('Error fetching featured products: ' + err.message);
  }
};