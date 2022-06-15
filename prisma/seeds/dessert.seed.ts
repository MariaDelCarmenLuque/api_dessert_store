import { Dessert } from '@prisma/client';

export async function dessertSeed(prisma): Promise<Dessert[]> {
  return await prisma.dessert.createMany({
    data: [
      {
        name: 'Chocolate Cupcake',
        description:
          'Chocolate-flavored cupcakes covered in chocolate with buttercream, royal icing, or whipped cream',
        price: 5.5,
        stock: 100,
        categoryId: 1,
        status: true,
      },
      {
        name: 'Vanilla Cupcake',
        description:
          'Vanilla-flavored cupcakes covered in royal icing or whipped cream',
        price: 5.5,
        stock: 100,
        categoryId: 1,
        status: true,
      },
      {
        name: 'Orange Cupcake',
        description:
          'Orange-flavored cupcakes covered in royal icing or whipped cream',
        price: 5.5,
        stock: 100,
        categoryId: 1,
        status: true,
      },
      {
        name: 'Butter Cake',
        description:
          'Cake in which one of tha main ingredients is butter, It have a smooth and pliable texture',
        price: 34.9,
        stock: 10,
        categoryId: 2,
        status: true,
      },
      {
        name: 'Chocolate Cake',
        description:
          'Cake flavored with melted chocolate, cocoa powder, or both.',
        price: 34.9,
        stock: 10,
        categoryId: 2,
        status: true,
      },
      {
        name: 'Chocolate Cheesecake',
        description:
          'This straightforward chocolate cheesecake is rich, moist, dense, and hugely chocolate.',
        price: 50,
        stock: 10,
        categoryId: 3,
        status: true,
      },
      {
        name: 'Strawberry Cheesecake',
        description:
          'a dessert consisting of a thick, creamy filling of cheese, eggs, and sugar over a thinner crust and topped with sweet or sometimes salty items.',
        price: 50,
        stock: 10,
        categoryId: 3,
        status: true,
      },
    ],
  });
}
