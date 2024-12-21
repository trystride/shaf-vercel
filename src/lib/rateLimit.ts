import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
	uniqueTokenPerInterval?: number;
	interval?: number;
}

export function rateLimit(options: RateLimitOptions = {}) {
	const tokenCache = new LRUCache({
		max: options.uniqueTokenPerInterval || 500,
		ttl: options.interval || 60000,
	});

	return {
		check: (limit: number, token: string) =>
			new Promise<void>((resolve, reject) => {
				const tokenCount = (tokenCache.get(token) as number[]) || [0];
				if (tokenCount[0] === 0) {
					tokenCache.set(token, tokenCount);
				}
				tokenCount[0] += 1;

				const currentUsage = tokenCount[0];
				const isRateLimited = currentUsage >= limit;

				if (isRateLimited) {
					return reject(new Error('Rate limit exceeded'));
				}

				return resolve();
			}),
	};
}
