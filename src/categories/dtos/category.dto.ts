export class CategoryDto {
  readonly id: number;
  /**
   * Name of category
   * @example 'cake'
   */
  readonly name: string;
  /**
   * Date of create a category
   */
  readonly createdAt: Date;
  /**
   * Date of update a category
   */
  readonly updatedAt: Date;
}
