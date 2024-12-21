import { authOptions } from './auth';
import { getServerSession } from 'next-auth';

export const isAuthorized = async (_request?: Request) => {
	const session = await getServerSession(authOptions);
	return session?.user;
};
