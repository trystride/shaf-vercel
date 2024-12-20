'use server';
import prisma from '@/libs/prisma';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { isAuthorized } from '@/libs/isAuthorized';

export async function getApiKeys() {
	const user = await isAuthorized();
	const res = await prisma.apiKey.findMany({
		where: {
			userId: user?.id as string,
		},
	});
	return res;
}

export async function createApiKey(keyName: string) {
	const user = await isAuthorized();

	if (!user) {
		return null;
	}

	const key = user.role as string;

	// Hash the key
	const hashedKey = await bcrypt.hash(key, 10);

	await prisma.apiKey.create({
		data: {
			name: keyName,
			key: hashedKey,
			userId: user.id,
		},
	});

	revalidatePath('/admin/api');
}

export async function deleteApiKey(id: string) {
	const res = await prisma.apiKey.delete({
		where: {
			id,
		},
	});

	revalidatePath('/admin/api');
	return res;
}

export async function createAPIKey(formData: FormData) {
	try {
		const session = await isAuthorized();

		if (!session) {
			throw new Error('Not authenticated');
		}

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;

		if (!name || !email) {
			throw new Error('Missing required fields');
		}

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new Error('User not found');
		}

		const apiKey = await prisma.apiKey.create({
			data: {
				name,
				key: bcrypt.hashSync(Date.now().toString(), 10),
				userId: user.id,
			},
		});

		revalidatePath('/admin/api');

		return {
			success: true,
			apiKey,
		};
	} catch (error) {
		return {
			error: 'Internal error',
		};
	}
}

export async function deleteAPIKey(formData: FormData) {
	try {
		const session = await isAuthorized();

		if (!session) {
			throw new Error('Not authenticated');
		}

		const id = formData.get('id') as string;
		const email = formData.get('email') as string;

		if (!id || !email) {
			throw new Error('Missing required fields');
		}

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new Error('User not found');
		}

		await prisma.apiKey.delete({
			where: {
				id,
			},
		});

		revalidatePath('/admin/api');

		return {
			success: true,
		};
	} catch (error) {
		return {
			error: 'Internal error',
		};
	}
}
