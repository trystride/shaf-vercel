import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { createLogger } from '../src/utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('prisma:seed');

async function main() {
	try {
		// Hash password
		const hashedPassword = await bcryptjs.hash('password123', 10);

		// Create test user
		const testUser = await prisma.user.findUnique({
			where: { email: 'test@test.com' },
		});

		if (!testUser) {
			await prisma.user.create({
				data: {
					email: 'test@test.com',
					name: 'Test User',
					password: hashedPassword,
					role: 'USER',
					notificationPreference: {
						create: {
							emailEnabled: true,
							emailFrequency: 'IMMEDIATE',
							emailDigestDay: null,
							emailDigestTime: null,
						},
					},
				},
			});
		}

		// Log success
		logger.info('Database has been seeded.');
	} finally {
		await prisma.$disconnect();
	}
}

main();
