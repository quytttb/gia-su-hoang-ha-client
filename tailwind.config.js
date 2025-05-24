/** @type {import('tailwindcss').Config} */
export default {
     content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
          extend: {
               colors: {
                    primary: "#007BFF",
                    white: "#FFFFFF",
               },
               fontFamily: {
                    sans: ['Roboto', 'sans-serif'],
               },
          },
     },
     plugins: [],
} 