const ProductModel = require('../models/product.model');

exports.getProducts = (req, res, next) => {
  try {
    const { category_id, available_only, featured_only } = req.query;
    const products = ProductModel.getAll({ category_id, available_only, featured_only });
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = (req, res, next) => {
  try {
    const product = ProductModel.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = (req, res, next) => {
  try {
    const newProduct = ProductModel.create(req.body);
    res.status(201).json({ data: newProduct, message: 'Producto agregado al catálogo' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = (req, res, next) => {
  try {
    const updated = ProductModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ data: updated, message: 'Producto actualizado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.toggleAvailability = (req, res, next) => {
  try {
    const { is_available } = req.body;
    const updated = ProductModel.toggleAvailability(req.params.id, is_available);
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ 
      data: updated, 
      message: updated.is_available ? 'Producto disponible para pedidos' : 'Producto pausado en el catálogo' 
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = (req, res, next) => {
  try {
    const result = ProductModel.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: result.message || 'Producto eliminado del catálogo', ...result });
  } catch (error) {
    next(error);
  }
};
