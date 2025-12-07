export default function Header() {
  return (
    <header className="w-full flex items-center justify-between py-6 px-6 sm:px-12 bg-bgLight">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="#0F172A"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>

        <h1 className="text-xl font-bold text-primary">
          Turfy Play Partner
        </h1>
      </div>

      {/* Login Button */}
      <div className="flex items-center gap-2 text-sm">
        <p className="text-secondary">Already have an account?</p>

       <button
  className="border border-[#22C55E] text-[#22C55E] px-4 py-1.5 rounded-lg hover:bg-[#22C55E] hover:text-white transition font-medium"
>
  Log In
</button>
      </div>
    </header>
  );
}