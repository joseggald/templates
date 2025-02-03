/**
 * @typedef {Object} Repository
 * @template T
 * @property {function(): Promise<T[]>} findAll - Find all records
 * @property {function(string|number): Promise<T|null>} findById - Find a record by ID
 * @property {function(Object): Promise<T>} create - Create a new record
 * @property {function(string|number, Object): Promise<T|null>} update - Update a record
 * @property {function(string|number): Promise<boolean>} delete - Delete a record
 */