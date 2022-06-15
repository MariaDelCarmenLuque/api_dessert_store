import { Role, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';

export async function userSeed(prisma): Promise<User[]> {
  const password = hashSync('Password123*', 10);
  const users = await prisma.user.createMany({
    data: [
      {
        role: Role.ADMIN,
        email: 'marialuque@ravn.co',
        userName: 'maritcarmn1',
        firstName: 'Maria',
        lastName: 'Luque',
        password,
      },
      {
        role: Role.USER,
        email: 'maritcarm.lq@gmail.com',
        userName: 'maritcarmn2',
        firstName: 'Maria del Carmen',
        lastName: 'Luque',
        password,
      },
    ],
  });
  return users;
}
