import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { prisma } from '@/libs/prismaDb';
import { z } from 'zod';

const notificationPreferenceSchema = z
	.object({
		emailEnabled: z.boolean(),
		emailFrequency: z.enum(['IMMEDIATE', 'DAILY', 'WEEKLY']),
		emailDigestDay: z.string().nullable(),
		emailDigestTime: z.string().nullable(),
	})
	.refine(
		(data) => {
			if (data.emailFrequency === 'WEEKLY' && data.emailEnabled) {
				return data.emailDigestDay !== null;
			}
			return true;
		},
		{
			message: 'Email digest day is required for weekly notifications',
			path: ['emailDigestDay'],
		}
	)
	.refine(
		(data) => {
			if (data.emailFrequency !== 'IMMEDIATE' && data.emailEnabled) {
				return data.emailDigestTime !== null;
			}
			return true;
		},
		{
			message:
				'Email digest time is required for daily and weekly notifications',
			path: ['emailDigestTime'],
		}
	);

export async function POST(req: NextRequest) {
	try {
		console.log('Starting notification preferences update...');
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			console.log('No authenticated user found');
			return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
				status: 401,
			});
		}

		console.log('Finding user:', session.user.email);
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				notificationPreference: true,
			},
		});

		if (!user) {
			console.log('User not found in database');
			return new NextResponse(JSON.stringify({ message: 'User not found' }), {
				status: 404,
			});
		}

		console.log('Parsing request body...');
		const body = await req.json();
		console.log('Request body:', body);

		try {
			console.log('Validating data...');
			const validatedData = notificationPreferenceSchema.parse(body);
			console.log('Validated data:', validatedData);

			// Only require digest day/time if email is enabled
			if (!validatedData.emailEnabled) {
				validatedData.emailDigestDay = null;
				validatedData.emailDigestTime = null;
			}

			// Validate time format if provided
			if (validatedData.emailDigestTime) {
				const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
				if (!timeRegex.test(validatedData.emailDigestTime)) {
					console.log('Invalid time format:', validatedData.emailDigestTime);
					return new NextResponse(
						JSON.stringify({
							message:
								'Invalid time format. Please use HH:mm format (e.g., 09:00)',
						}),
						{ status: 400 }
					);
				}
			}

			// Validate day of week if provided
			if (validatedData.emailDigestDay) {
				const validDays = [
					'MONDAY',
					'TUESDAY',
					'WEDNESDAY',
					'THURSDAY',
					'FRIDAY',
					'SATURDAY',
					'SUNDAY',
				];
				if (!validDays.includes(validatedData.emailDigestDay)) {
					console.log('Invalid day of week:', validatedData.emailDigestDay);
					return new NextResponse(
						JSON.stringify({
							message:
								'Invalid day of week. Must be one of: ' + validDays.join(', '),
						}),
						{ status: 400 }
					);
				}
			}

			console.log('Updating notification preferences...');
			const updatedPreference = await prisma.notificationPreference.upsert({
				where: {
					userId: user.id,
				},
				create: {
					userId: user.id,
					...validatedData,
				},
				update: validatedData,
			});

			console.log('Successfully updated preferences:', updatedPreference);
			return NextResponse.json(updatedPreference);
		} catch (validationError) {
			if (validationError instanceof z.ZodError) {
				console.log('Validation error:', validationError.errors);
				return new NextResponse(
					JSON.stringify({
						message: 'Invalid request data',
						errors: validationError.errors,
					}),
					{ status: 400 }
				);
			}

			console.error('Database error:', validationError);
			return new NextResponse(
				JSON.stringify({
					message: 'Failed to save preferences. Please try again later.',
					error:
						process.env.NODE_ENV === 'development'
							? validationError
							: undefined,
				}),
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Unhandled error:', error);
		return new NextResponse(
			JSON.stringify({
				message: 'Internal Server Error',
				error:
					process.env.NODE_ENV === 'development'
						? error instanceof Error
							? error.message
							: 'Unknown error'
						: undefined,
			}),
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
				status: 401,
			});
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: { notificationPreference: true },
		});

		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'User not found' }), {
				status: 404,
			});
		}

		return NextResponse.json(
			user.notificationPreference || {
				emailEnabled: true,
				emailFrequency: 'IMMEDIATE',
				emailDigestDay: null,
				emailDigestTime: null,
			}
		);
	} catch (error) {
		console.error('Error fetching notification preferences:', error);
		return new NextResponse(
			JSON.stringify({
				message: 'Internal Server Error',
				error:
					process.env.NODE_ENV === 'development'
						? error instanceof Error
							? error.message
							: 'Unknown error'
						: undefined,
			}),
			{ status: 500 }
		);
	}
}
