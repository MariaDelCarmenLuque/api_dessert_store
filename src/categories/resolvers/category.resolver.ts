import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCategoryInput } from '../dtos/input/create-category.input';
import { UpdateCategoryInput } from '../dtos/input/update-category.input';
import { Category } from '../models/category.model';
import { CategoriesService } from '../service/categories.service';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category], {
    description: 'Query: Return all categories',
    name: 'categoryGetAll',
  })
  async getAllCategories() {
    return await this.categoriesService.getAll();
  }

  @Query(() => Category, {
    description: 'Query: Return a category by Id',
    name: 'categoryGetOne',
  })
  async getOneCategory(@Args('id') id: number) {
    return await this.categoriesService.findOne(id);
  }

  @Mutation(() => Category, {
    description: 'Mutation: Create a Category',
    name: 'categoryCreate',
  })
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return await this.categoriesService.create(createCategoryInput);
  }

  @Mutation(() => Category, {
    description: 'Mutation: Update a Category',
    name: 'categoryUpdate',
  })
  async updateCategory(
    @Args('id') id: number,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return await this.categoriesService.updateCategory(id, updateCategoryInput);
  }
}
