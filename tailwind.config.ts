import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		fontFamily: {
			satoshi: ["Satoshi", "sans-serif"],
			inter: ["Inter", "sans-serif"],
		},
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "2rem",
				xl: "0",
			},
		},
		screens: {
			xsm: "375px",
			lsm: "425px",
			"3xl": "2000px",
			...defaultTheme.screens,
		},
		extend: {
			colors: {
				current: "currentColor",
				transparent: "transparent",
				white: "#FFFFFF",
				black: "#0E172B",
				body: "#64748B",
				stroke: {
					DEFAULT: "#E8E8E8",
					dark: "#394152",
				},
				primary: {
					DEFAULT: "#635BFF",
					dark: "#3E22E9",
				},
				dark: {
					DEFAULT: "#1C274C",
					2: "#495270",
					3: "#606882",
					4: "#8D93A5",
					5: "#BBBEC9",
				},
				gray: {
					DEFAULT: "#F3F5F6",
					1: "#F9FAFB",
					2: "#F3F4F6",
					3: "#E5E7EB",
					4: "#D1D5DB",
					5: "#9CA3AF",
					6: "#6B7280",
					7: "#374151",
					dark: "#272E40",
				},
				red: {
					...colors.red,
					DEFAULT: "#F23030",
					light: "#F56060",
					"light-5": "#FEEBEB",
					"light-6": "#FEF3F3",
				},
				green: {
					...colors.green,
					DEFAULT: "#00BC55",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			fontSize: {
				"heading-1": ["60px", "72px"],
				"heading-2": ["48px", "58px"],
				"heading-3": ["40px", "48px"],
				"heading-4": ["35px", "45px"],
				"heading-5": ["28px", "40px"],
				"heading-6": ["24px", "30px"],
				"custom-2xl": ["22px", "30px"],
				"custom-3xl": ["32px", "40px"],
			},
			spacing: {
				4.5: "1.125rem",
				5.5: "1.375rem",
				6.5: "1.625rem",
				7.5: "1.875rem",
				8.5: "2.125rem",
				9.5: "2.375rem",
				10: "2.5rem",
				10.5: "2.625rem",
				11: "2.75rem",
				11.5: "2.875rem",
				12.5: "3.125rem",
				13: "3.25rem",
				13.5: "3.375rem",
				14: "3.5rem",
				14.5: "3.625rem",
				15: "3.75rem",
				15.5: "3.875rem",
				16: "4rem",
				16.5: "4.125rem",
				17: "4.25rem",
				17.5: "4.375rem",
				18: "4.5rem",
				18.5: "4.625rem",
				19: "4.75rem",
				19.5: "4.875rem",
				21: "5.25rem",
				21.5: "5.375rem",
				22: "5.5rem",
				22.5: "5.625rem",
				24.5: "6.125rem",
				25: "6.25rem",
				25.5: "6.375rem",
				26: "6.5rem",
				27: "6.75rem",
				27.5: "6.875rem",
				29: "7.25rem",
				29.5: "7.375rem",
				30: "7.5rem",
				31: "7.75rem",
				31.5: "7.875rem",
				32.5: "8.125rem",
				33: "8.25rem",
				34: "8.5rem",
				34.5: "8.625rem",
				35: "8.75rem",
				36.5: "9.125rem",
				37: "9.25rem",
				37.5: "9.375rem",
				39: "9.75rem",
				39.5: "9.875rem",
				40: "10rem",
				42.5: "10.625rem",
				45: "11.25rem",
				46: "11.5rem",
				47.5: "11.875rem",
				49: "12.25rem",
				50: "12.5rem",
				51: "12.75rem",
				51.5: "12.875rem",
				52: "13rem",
				52.5: "13.125rem",
				54: "13.5rem",
				54.5: "13.625rem",
				55: "13.75rem",
				55.5: "13.875rem",
				57.5: "14.375rem",
				59: "14.75rem",
				60: "15rem",
				62.5: "15.625rem",
				65: "16.25rem",
				67: "16.75rem",
				67.5: "16.875rem",
				70: "17.5rem",
				72.5: "18.125rem",
				75: "18.75rem",
				90: "22.5rem",
				92.5: "23.125rem",
				94: "23.5rem",
				100: "25rem",
				110: "27.5rem",
				115: "28.75rem",
				122.5: "30.625rem",
				125: "31.25rem",
				127.5: "31.875rem",
				132.5: "33.125rem",
				142.5: "35.625rem",
				150: "37.5rem",
				166.5: "41.625rem",
				171.5: "42.875rem",
				180: "45rem",
				187.5: "46.875rem",
				192.5: "48.125rem",
				203: "50.75rem",
				230: "57.5rem",
			},
			maxWidth: {
				30: "7.5rem",
				40: "10rem",
				50: "12.5rem",
			},
			borderRadius: {
				10: "10px",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			zIndex: {
				999999: "999999",
				99999: "99999",
				9999: "9999",
				999: "999",
				99: "99",
				1: "1",
			},
			boxShadow: {
				1: "0px 1px 2px 0px rgba(84, 87, 118, 0.10)",
				error: "0px 12px 34px 0px rgba(13, 10, 44, 0.05)",
				input: "inset 0 0 0 2px #573CFF",
				dropdown: "0px 4px 12px 0px rgba(15, 23, 42, 0.10)",
				darkdropdown: "0px 4px 12px 0px rgba(255, 255, 255, 0.05)",
				features: "0px 8px 20px 0px rgba(113, 116, 152, 0.05)",
				testimonial: "0px 8px 10px -6px rgba(15, 23, 42, 0.06)",
				"testimonial-2": "0px 15px 50px -6px rgba(15, 23, 42, 0.08)",
			},
		},
	},
	plugins: [],
};
export default config;
