import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const apiKeyId = searchParams.get('apiKeyId');

		if (!apiKeyId) {
			return new NextResponse('Missing Fields', { status: 400 });
		}

		await prisma.apiKey.delete({
			where: {
				id: apiKeyId,
			},
		});

		return new NextResponse('API Key Deleted Successfully!', { status: 200 });
	} catch (error) {
		return new NextResponse('Something went wrong', { status: 500 });
	}
}
