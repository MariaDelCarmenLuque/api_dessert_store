import { Role, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';

export async function userSeed(prisma): Promise<User[]> {
  const password = hashSync('Password123*', 10);
  return Promise.all([
    prisma.user.createMany({
      data: [
        {
          role: Role.ADMIN,
          email: 'alexisgomez@ravn.co',
          userName: 'alexisgomez',
          firstName: 'Alexis',
          lastName: 'Gomez',
          password,
        },
        {
          role: Role.ADMIN,
          email: 'kevinescoto@ravn.co',
          userName: 'kevinescoto',
          firstName: 'Kevin',
          lastName: 'Rodríguez',
          password,
        },
      ],
    }),
    prisma.user.create({
      data: {
        role: Role.USER,
        email: 'marialuque@gmail.com',
        userName: 'marialuque',
        firstName: 'Maria del Carmen',
        lastName: 'Luque',
        password,
      },
    }),
  ]);
}
