export default function PersonalDetails({
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-dark-navy-blue pb-3">
        Personal Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Full Name */}
        <label className="flex flex-col">
          <p className="text-sm text-dark-navy-blue pb-2">Full Name as on ID</p>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50"
          />
        </label>

        {/* Mobile */}
        <label className="flex flex-col">
          <p className="text-sm text-dark-navy-blue pb-2">Mobile Number</p>
          <div className="relative">
            <span className="absolute left-3 top-3 text-secondary-text">+20</span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="100 123 4567"
              className="h-12 pl-12 pr-4 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </label>

        {/* Email */}
        <label className="flex flex-col sm:col-span-2">
          <p className="text-sm text-dark-navy-blue pb-2">Email Address</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50"
          />
        </label>

      </div>
    </div>
  );
}