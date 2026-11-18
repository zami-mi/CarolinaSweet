const ClientModel = require('../models/client.model');

exports.getClients = (req, res, next) => {
  try {
    const { search, include_inactive } = req.query;
    const clients = ClientModel.getAll({ search, include_inactive });
    res.json({ data: clients });
  } catch (error) {
    next(error);
  }
};

exports.getClientById = (req, res, next) => {
  try {
    const client = ClientModel.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ data: client });
  } catch (error) {
    next(error);
  }
};

exports.createClient = (req, res, next) => {
  try {
    const newClient = ClientModel.create(req.body);
    res.status(201).json({ data: newClient, message: 'Cliente registrado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateClient = (req, res, next) => {
  try {
    const updated = ClientModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ data: updated, message: 'Cliente actualizado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.toggleClientStatus = (req, res, next) => {
  try {
    const { is_active } = req.body;
    const updated = ClientModel.toggleStatus(req.params.id, is_active);
    if (!updated) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({
      data: updated,
      message: updated.is_active ? 'Cliente activado con éxito' : 'Cliente desactivado (baja lógica)'
    });
  } catch (error) {
    next(error);
  }
};
