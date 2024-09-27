import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string) => {
    return await prisma.users.findUnique({
      where: { email: email },
    });
  };

export default prisma;
