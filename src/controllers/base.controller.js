/**
 * Controlador base que proporciona operaciones CRUD genéricas
 * @param {mongoose.Model} model - El modelo de Mongoose a utilizar
 */
class BaseController {
  constructor(model, populateFields = []) {
    this.model = model;
    this.populateFields = populateFields;
  }

  /**
   * Obtiene todos los registros
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<Response>} Array de documentos
   */
  async getAll(req, res) {
    try {
      const items = await this.model.find().populate(this.populateFields);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Obtiene un registro por su ID
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {string} req.params.id - ID del documento a buscar
   * @returns {Promise<Response>} Documento encontrado
   */
  async getById(req, res) {
    try {
      const item = await this.model
        .findById(req.params.id)
        .populate(this.populateFields);
      if (!item) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Crea un nuevo registro
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Object} req.body - Datos del nuevo documento
   * @returns {Promise<Response>} Documento creado
   */
  async create(req, res) {
    try {
      const item = new this.model(req.body);
      const savedItem = await item.save();
      const populatedItem = await this.model
        .findById(savedItem._id)
        .populate(this.populateFields);
      res.status(201).json(populatedItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Actualiza un registro existente
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {string} req.params.id - ID del documento a actualizar
   * @param {Object} req.body - Datos actualizados del documento
   * @returns {Promise<Response>} Documento actualizado
   */
  async update(req, res) {
    try {
      const item = await this.model
        .findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        })
        .populate(this.populateFields);
      if (!item) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Elimina un registro
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {string} req.params.id - ID del documento a eliminar
   * @returns {Promise<Response>} Mensaje de confirmación
   */
  async delete(req, res) {
    try {
      const item = await this.model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.status(200).json({ message: 'Item eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default BaseController;
