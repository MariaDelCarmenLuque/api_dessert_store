import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCategoryInput } from '../dtos/input/create-category.input';
import { UpdateCategoryInput } from '../dtos/input/update-category.input';
import { Category } from '../models/category.model';
import { CategoriesService } from '../service/categories.service';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category], { description: 'Query: Return all categories' })
  async categoriesGetAll() {
    return await this.categoriesService.getAll();
  }

  @Query(() => Category, { description: 'Query: Return a category by Id' })
  async categoryGetOne(@Args('id') id: number) {
    return await this.categoriesService.findOne(id);
  }

  @Mutation(() => Category, { description: 'Mutation: Create a Category' })
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return await this.categoriesService.create(createCategoryInput);
  }

  @Mutation(() => Category, { description: 'Mutation: Update a Category' })
  async updateCategory(
    @Args('id') id: number,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return await this.categoriesService.updateCategory(id, updateCategoryInput);
  }
}
