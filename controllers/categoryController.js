const Category = require('../model/Category');
module.exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).send('Error fetching categories: ' + err.message);
    }
};




// Get a category by ID
module.exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.status(200).json(category);
    } catch (err) {
        res.status(500).send('Error fetching category: ' + err.message);
    }
};


module.exports.createCategory = async (req, res) => {
    try {
        const { name, color, icon } = req.body;

        const newCategory = new Category({
            name,
            color,
            icon,
           
        });

        await newCategory.save();
        res.status(201).send('Category created successfully!'+ newCategory);
    } catch (err) {
        res.status(404).send('Error creating category: ' + err.message);
    }
};

// Delete a category by ID
module.exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).send('Category not found');
        }

        res.status(200).send('Category deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting category: ' + err.message);
    }};




// Update a category by ID
module.exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, color, icon } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
            name,
            color,
            icon,
         
        }, { new: true });

        if (!updatedCategory) {
            return res.status(404).send('Category not found');
        }

        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).send('Error updating category: ' + err.message);
    }
};
