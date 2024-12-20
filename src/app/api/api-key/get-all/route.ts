import { prisma } from '@/libs/prismaDb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
		});

		if (!user) {
			return new NextResponse('User not found!', { status: 404 });
		}

		const apiKeys = await prisma.apiKey.findMany({
			where: {
				userId: user.id,
			},
			select: {
				id: true,
				name: true,
				createdAt: true,
			},
		});

		return NextResponse.json(apiKeys);
	} catch (error) {
		return new NextResponse('Something went wrong', { status: 500 });
	}
}
