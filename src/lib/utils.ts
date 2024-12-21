import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
	return `${process.env.SITE_URL || 'http://localhost:3000'}${path}`;
}

/**
 * Validates email format
 * @param email Email to validate
 * @returns boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param password Password to validate
 * @returns boolean indicating if password meets strength requirements
 */
export const isStrongPassword = (password: string): boolean => {
	// At least 8 characters long
	if (password.length < 8) return false;

	// Contains at least one uppercase letter
	if (!/[A-Z]/.test(password)) return false;

	// Contains at least one lowercase letter
	if (!/[a-z]/.test(password)) return false;

	// Contains at least one number
	if (!/\d/.test(password)) return false;

	// Contains at least one special character
	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

	return true;
};

// Types for rate limiting
export interface RateLimitConfig {
	interval: number;
	uniqueTokenPerInterval: number;
}

export interface RateLimiter {
	check: (request: Request, limit: number, token: string) => Promise<boolean>;
}

/**
 * Rate limiting utility
 * @param config Configuration for rate limiting
 * @returns RateLimiter instance
 */
export const rateLimit = (config: RateLimitConfig): RateLimiter => {
	const tokenCache = new Map<string, number>();

	return {
		check: async (request: Request, limit: number, token: string) => {
			const now = Date.now();
			const windowStart = now - config.interval;

			// Clean old tokens
			tokenCache.forEach((timestamp, key) => {
				if (timestamp < windowStart) {
					tokenCache.delete(key);
				}
			});

			// Get IP for rate limiting
			const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
			const tokenKey = `${token}:${ip}`;

			// Check rate limit
			const tokenCount = tokenCache.get(tokenKey) || 0;
			if (tokenCount >= limit) {
				throw new Error('Rate limit exceeded');
			}

			tokenCache.set(tokenKey, tokenCount + 1);
			return true;
		},
	};
};
