/** @type {import('tailwindcss').Config} */
export default {
     content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
     ],
     darkMode: ['class'],
     theme: {
          container: {
               center: true,
               padding: "2rem",
               screens: {
                    "2xl": "1400px",
               },
          },
          extend: {
               colors: {
                    border: "hsl(var(--border))",
                    input: "hsl(var(--input))",
                    ring: "hsl(var(--ring))",
                    background: "hsl(var(--background))",
                    foreground: "hsl(var(--foreground))",
                    primary: {
                         DEFAULT: "hsl(var(--primary))",
                         foreground: "hsl(var(--primary-foreground))",
                         50: "#EFF6FF",
                         100: "#DBEAFE",
                         200: "#BFDBFE",
                         300: "#93C5FD",
                         400: "#60A5FA",
                         500: "#3B82F6",
                         600: "#2563EB",
                         700: "#1D4ED8",
                         800: "#1E40AF",
                         900: "#1E3A8A",
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
                         50: "#FFF9E6",
                         100: "#FFF2CC",
                         200: "#FFE699",
                         300: "#FFD966",
                         400: "#FFCC33",
                         500: "#FFB800",
                         600: "#CC9400",
                         700: "#996F00",
                         800: "#664A00",
                         900: "#332500",
                    },
                    popover: {
                         DEFAULT: "hsl(var(--popover))",
                         foreground: "hsl(var(--popover-foreground))",
                    },
                    card: {
                         DEFAULT: "hsl(var(--card))",
                         foreground: "hsl(var(--card-foreground))",
                    },
                    gray: {
                         50: "#F9FAFB",
                         100: "#F3F4F6",
                         200: "#E5E7EB",
                         300: "#D1D5DB",
                         400: "#9CA3AF",
                         500: "#6B7280",
                         600: "#4B5563",
                         700: "#374151",
                         800: "#1F2937",
                         900: "#111827",
                    },
               },
               borderRadius: {
                    lg: "var(--radius)",
                    md: "calc(var(--radius) - 2px)",
                    sm: "calc(var(--radius) - 4px)",
               },
               fontFamily: {
                    sans: ['Roboto', 'sans-serif'],
               },
               animation: {
                    'fade-in': 'fadeIn 0.5s ease-in-out',
                    'slide-in': 'slideIn 0.3s ease-out',
                    'scale-in': 'scaleIn 0.2s ease-out',
                    'bounce-gentle': 'bounceGentle 2s infinite',
               },
               keyframes: {
                    fadeIn: {
                         '0%': { opacity: '0' },
                         '100%': { opacity: '1' },
                    },
                    slideIn: {
                         '0%': { transform: 'translateY(-10px)', opacity: '0' },
                         '100%': { transform: 'translateY(0)', opacity: '1' },
                    },
                    scaleIn: {
                         '0%': { transform: 'scale(0.95)', opacity: '0' },
                         '100%': { transform: 'scale(1)', opacity: '1' },
                    },
                    bounceGentle: {
                         '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                         '40%': { transform: 'translateY(-4px)' },
                         '60%': { transform: 'translateY(-2px)' },
                    },
               },
          },
     },
     plugins: [],
} 