import { PrismaClient } from '@prisma/client';

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
	return new PrismaClient({
		log:
			process.env.NODE_ENV === 'development'
				? ['query', 'error', 'warn']
				: ['error', 'warn'],
		errorFormat: 'pretty',
	});
};

const prismaDb = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
	global.prisma = prismaDb;
}

export { prismaDb as prisma };
export default prismaDb;
