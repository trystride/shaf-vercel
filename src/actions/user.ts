'use server';
import prisma from '@/libs/prisma';
import { isAuthorized } from '@/libs/isAuthorized';
import type { User } from '@prisma/client';

type UserRole = 'USER' | 'ADMIN';

export async function getUsers(filter?: UserRole) {
	const user = await isAuthorized();
	if (!user) {
		return null;
	}

	const users = await prisma.user.findMany({
		where: filter
			? {
					role: filter,
				}
			: {
					NOT: {
						email: {
							startsWith: 'demo-',
						},
					},
				},
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			notificationPreference: true,
		},
	});

	const filteredUsers = users.filter(
		(u: User) => u.email !== user?.email && !u.email?.includes('demo-')
	);

	return filteredUsers;
}

interface UpdateUserData {
	email: string;
	name?: string;
	image?: string;
	role?: UserRole;
}

export async function updateUser(data: UpdateUserData) {
	const { email, ...rest } = data;
	return await prisma.user.update({
		where: {
			email: email.toLowerCase(),
		},
		data: {
			...rest,
			email: email.toLowerCase(),
		},
	});
}

export async function deleteUser(formData: FormData) {
	try {
		const user = await isAuthorized();
		if (!user) {
			return {
				error: 'Unauthorized',
			};
		}

		const id = formData.get('id') as string;
		const email = formData.get('email') as string;

		if (email.startsWith('demo-')) {
			return {
				error: 'Cannot delete demo user',
			};
		}

		const userToDelete = await prisma.user.findUnique({
			where: {
				id,
			},
		});

		if (!userToDelete) {
			return {
				error: 'User not found',
			};
		}

		await prisma.user.delete({
			where: {
				id,
			},
		});

		return {
			success: true,
		};
	} catch (error) {
		return {
			error: 'Internal error',
		};
	}
}

export async function searchUser(email: string) {
	return await prisma.user.findUnique({
		where: {
			email: email.toLowerCase(),
		},
	});
}

export async function getUser(id: string) {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
		include: {
			notificationPreference: true,
		},
	});

	if (!user || !user.email) {
		return null;
	}

	if (user.email.startsWith('demo-')) {
		return null;
	}

	return user;
}
