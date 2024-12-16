/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '7.5': '1.875rem',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        body: "#64748B",
        "body-dark": "#9BA2AE",
        "gray-dark": "#1E293B",
        "gray-2": "#64748B",
        "gray-3": "#334155",
        "gray-4": "#94A3B8",
        "gray-5": "#E2E8F0",
        stroke: {
          DEFAULT: "#E2E8F0",
          dark: "#2E3A47"
        },
        "stroke-dark": "#2E3A47",
        dark: {
          DEFAULT: "#1E293B",
          2: "#334155",
          3: "#0F172A",
          4: "#1E293B",
        },
        text: {
          body: "#64748B",
        },
      },
      boxShadow: {
        'dropdown': '0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)',
        'input': '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 0px 0px 4px rgba(234, 76, 137, 0.10)',
        'pricing': '0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)',
        'card': '0px 1px 3px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)',
        'card-2': '0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
