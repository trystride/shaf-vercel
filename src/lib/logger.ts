/* eslint-disable no-console */
const logger = {
	info: (...args: any[]) => {
		if (process.env.NODE_ENV !== 'production') {
			console.log(...args);
		}
	},
	error: (...args: any[]) => {
		if (process.env.NODE_ENV !== 'production') {
			console.error(...args);
		}
	},
	warn: (...args: any[]) => {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(...args);
		}
	},
};

export default logger;
