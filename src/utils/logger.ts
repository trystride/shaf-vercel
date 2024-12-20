type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMeta {
	[key: string]: unknown;
}

interface LogEntry {
	timestamp: string;
	level: LogLevel;
	context: string;
	message: string;
	meta?: LogMeta;
}

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
	private context: string;

	constructor(context: string) {
		this.context = context;
	}

	private formatLog(
		level: LogLevel,
		message: string,
		meta?: LogMeta
	): LogEntry {
		return {
			timestamp: new Date().toISOString(),
			level,
			context: this.context,
			message,
			...(meta && { meta }),
		};
	}

	private log(level: LogLevel, message: string, meta?: LogMeta) {
		if (!isDevelopment && level === 'debug') return;

		const logEntry = this.formatLog(level, message, meta);

		// In development, use console with colors
		if (isDevelopment) {
			switch (level) {
				case 'debug':
					console.debug(logEntry);
					break;
				case 'info':
					console.info(logEntry);
					break;
				case 'warn':
					console.warn(logEntry);
					break;
				case 'error':
					console.error(logEntry);
					break;
			}
		} else {
			// In production, format as JSON for log aggregation
			console.log(JSON.stringify(logEntry));
		}
	}

	debug(message: string, meta?: LogMeta) {
		this.log('debug', message, meta);
	}

	info(message: string, meta?: LogMeta) {
		this.log('info', message, meta);
	}

	warn(message: string, meta?: LogMeta) {
		this.log('warn', message, meta);
	}

	error(message: string, meta?: LogMeta) {
		this.log('error', message, meta);
	}
}

export const createLogger = (context: string) => new Logger(context);
