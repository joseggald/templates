/**
 * Generic MongoDB Repository implementation
 * @template T
 * @implements {Repository<T>}
 */
class MongoRepository {
  /**
   * @param {import('mongoose').Model} model - Mongoose model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Find all documents
   * @returns {Promise<T[]>}
   */
  async findAll() {
    return this.model.find().exec();
  }

  /**
   * Find document by ID
   * @param {string} id - Document ID
   * @returns {Promise<T|null>}
   */
  async findById(id) {
    return this.model.findById(id).exec();
  }

  /**
   * Create new document
   * @param {Partial<T>} data - Document data
   * @returns {Promise<T>}
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Partial<T>} data - Update data
   * @returns {Promise<T|null>}
   */
  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}

module.exports = {
  MongoRepository
};