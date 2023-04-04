import { type Config } from "tailwindcss";
// import { colors } from 'tailwindcss'

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#cc66ff'
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
