import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
	try {
		const { name } = await req.json();

		if (!name) {
			return new NextResponse('Missing Fields', { status: 400 });
		}

		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return new NextResponse('User not found!', { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
		});

		if (!user) {
			return new NextResponse('User not found!', { status: 404 });
		}

		const apiKey = `${user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
		const hashedApiKey = await bcrypt.hash(apiKey, 10);

		const newApiKey = await prisma.apiKey.create({
			data: {
				name,
				key: hashedApiKey,
				userId: user.id,
			},
		});

		return NextResponse.json({ apiKey, id: newApiKey.id });
	} catch (error) {
		return new NextResponse('Something went wrong', { status: 500 });
	}
}
