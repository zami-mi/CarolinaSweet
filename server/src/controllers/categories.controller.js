const CategoryModel = require('../models/category.model');

exports.getCategories = (req, res, next) => {
  try {
    const categories = CategoryModel.getAll();
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = (req, res, next) => {
  try {
    const category = CategoryModel.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ data: category });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = (req, res, next) => {
  try {
    const newCategory = CategoryModel.create(req.body);
    res.status(201).json({ data: newCategory, message: 'Categoría creada con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
