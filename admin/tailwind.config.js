/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        primary: "#10B981",       // الأخضر الأساسي
        secondary: "#3B82F6",     // الأزرق
        "dark-navy": "#1E293B",   // الكحلي الغامق (خلفية النافبار)
        "light-gray": "#F8FAFC",  // خلفية الصفحات
        "text-dark": "#334155",   // العناوين
        "text-light": "#64748B",  // النصوص الفرعية
        "border-color": "#E2E8F0",// لون الحدود
      },
      // 2. الخطوط
      fontFamily: {
        display: ["Manrope", "sans-serif"], // هنستخدم font-display عشان يطبق الخط ده
      },
      // 3. تدوير الحواف
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}