const OrderModel = require('../models/order.model');

exports.getOrders = (req, res, next) => {
  try {
    const { status, client_id, date, favorite_only, search } = req.query;
    const orders = OrderModel.getAll({ status, client_id, date, favorite_only, search });
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = (req, res, next) => {
  try {
    const order = OrderModel.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({ data: order });
  } catch (error) {
    next(error);
  }
};

exports.createOrder = (req, res, next) => {
  try {
    const newOrder = OrderModel.create(req.body);
    res.status(201).json({ data: newOrder, message: 'Pedido registrado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrder = (req, res, next) => {
  try {
    const updated = OrderModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({ data: updated, message: 'Pedido actualizado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStatus = (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'El campo "status" es obligatorio' });
    }
    const updated = OrderModel.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({ data: updated, message: `Estado del pedido #${req.params.id} actualizado a "${status}"` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.toggleFavorite = (req, res, next) => {
  try {
    const updated = OrderModel.toggleFavorite(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({ data: updated, message: updated.is_favorite ? 'Marcado como favorito' : 'Quitado de favoritos' });
  } catch (error) {
    next(error);
  }
};

exports.duplicateOrder = (req, res, next) => {
  try {
    const { delivery_date } = req.body;
    const duplicated = OrderModel.duplicate(req.params.id, delivery_date);
    if (!duplicated) {
      return res.status(404).json({ error: 'Pedido original no encontrado' });
    }
    res.status(201).json({ data: duplicated, message: 'Pedido duplicado exitosamente en estado Pendiente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cleanupCancelled = (req, res, next) => {
  try {
    const result = OrderModel.cleanupOldCancelled();
    res.json({ message: 'Limpieza de pedidos cancelados (+365 días) completada', ...result });
  } catch (error) {
    next(error);
  }
};
