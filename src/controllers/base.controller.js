
class BaseController {
  constructor(model, populateFields = []) {
    this.model = model;
    this.populateFields = populateFields;
  }


  async getAll(req, res) {
    try {
      const items = await this.model.find().populate(this.populateFields);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


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
