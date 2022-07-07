import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt.guard';
import { GqlRolesGuard } from 'src/auth/guards/gql-roles.guard';
import { Role } from 'src/auth/roles.enum';
import { CreateCategoryInput } from '../dtos/input/create-category.input';
import { PaginationOptionsCategoryInput } from '../dtos/input/pagination-options-category.input';
import { UpdateCategoryInput } from '../dtos/input/update-category.input';
import { Category } from '../models/category.model';
import { PaginatedCategory } from '../models/paginated-category.model';
import { CategoriesService } from '../service/categories.service';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => PaginatedCategory, {
    description: 'Query: Return a list of categories',
    name: 'categoryGetAll',
  })
  async getAllCategories(
    @Args('paginationOptions')
    paginationOptions: PaginationOptionsCategoryInput,
  ) {
    const { categories, pagination } = await this.categoriesService.getAll(
      paginationOptions,
    );
    const data = categories.map((category) => ({
      node: {
        ...category,
      },
    }));

    return {
      edges: data,
      pageInfo: pagination,
    };
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
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return await this.categoriesService.create(createCategoryInput);
  }

  @Mutation(() => Category, {
    description: 'Mutation: Update a Category',
    name: 'categoryUpdate',
  })
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async updateCategory(
    @Args('id') id: number,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return await this.categoriesService.updateCategory(id, updateCategoryInput);
  }
}
