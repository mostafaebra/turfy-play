export default function OwnerloginHeader() {
  return (
    <div className="flex items-center gap-3">
      <svg
        className="h-8 w-8 text-primary"
        fill="none"
        height="32"
        stroke="#1E293B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="32"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>

      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        Turfy Play Partner
      </h1>
    </div>
  );
}