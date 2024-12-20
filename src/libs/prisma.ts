import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
	return new PrismaClient();
};

type GlobalWithPrisma = typeof globalThis & {
	prisma?: ReturnType<typeof prismaClientSingleton>;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

export default prisma;
