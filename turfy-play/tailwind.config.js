/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
       extend: {
  colors: {
    primary: "#0F172A",   
    secondary: "#64748B",  
    bgLight: "#F8FAFC",
    borderLight: "#E2E8F0",
    inputBg: "#FFFFFF"
  }
}
    },
  },
  plugins: [],
};
