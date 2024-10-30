/**
 * Generic Base Repository Interface
 *
 * Defines the standard CRUD operations that all repositories should implement.
 * This interface serves as a contract for basic data persistence operations
 * across different entity types.
 *
 * @typeParam T - The entity type this repository manages. Must be an object with an 'id' property.
 *
 * @example
 * ```typescript
 * // Implementing the base repository
 * class UserRepository implements IBaseRepository<User> {
 *   create(data: Omit<User, "id">): Promise<User> {
 *     // Implementation
 *   }
 *   // ... other method implementations
 * }
 * ```
 */
export interface IBaseRepository<T extends { id: string }> {
  /**
   * Creates a new entity in the data store.
   *
   * @param data - The entity data to create, excluding the 'id' field which will be generated
   * @returns Promise resolving to the created entity including its generated id
   * @throws {ValidationError} If the data is invalid
   * @throws {DatabaseError} If the creation operation fails
   */
  create(data: Omit<T, "id">): Promise<T>;

  /**
   * Retrieves an entity by its unique identifier.
   *
   * @param id - The unique identifier of the entity
   * @returns Promise resolving to the found entity or null if not found
   * @throws {DatabaseError} If the retrieval operation fails
   */
  findById(id: string): Promise<T | null>;

  /**
   * Updates an existing entity with partial data.
   *
   * @param id - The unique identifier of the entity to update
   * @param data - Partial entity data containing only the fields to update
   * @returns Promise resolving to the updated entity
   * @throws {NotFoundError} If the entity with given id doesn't exist
   * @throws {ValidationError} If the update data is invalid
   * @throws {DatabaseError} If the update operation fails
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Deletes an entity from the data store.
   *
   * @param id - The unique identifier of the entity to delete
   * @returns Promise resolving when the deletion is complete
   * @throws {NotFoundError} If the entity with given id doesn't exist
   * @throws {DatabaseError} If the deletion operation fails
   */
  delete(id: string): Promise<void>;
}
