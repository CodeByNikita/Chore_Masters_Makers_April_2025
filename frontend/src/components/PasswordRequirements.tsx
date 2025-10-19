export const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  return (
    <div className="bg-indigo-50 p-4 rounded-lg mt-2">
      <h4 className="text-sm font-medium text-indigo-800 mb-2">
        Password must contain:
      </h4>
      <ul className="text-sm text-indigo-700 space-y-1">
        <li
          className={`flex items-center ${
            requirements.length
              ? "text-green-600 font-semibold"
              : "text-indigo-700"
          }`}
        >
          <SvgComp />
          At least 8 characters
        </li>
        <li
          className={`flex items-center ${
            requirements.uppercase
              ? "text-green-600 font-semibold"
              : "text-indigo-700"
          }`}
        >
          <SvgComp />
          One uppercase letter
        </li>
        <li
          className={`flex items-center ${
            requirements.number
              ? "text-green-600 font-semibold"
              : "text-indigo-700"
          }`}
        >
          <SvgComp />
          One number
        </li>
        <li
          className={`flex items-center ${
            requirements.special
              ? "text-green-600 font-semibold"
              : "text-indigo-700"
          }`}
        >
          <SvgComp />
          One special character (!@#$%^&*)
        </li>
      </ul>
    </div>
  );
};

const SvgComp = () => {
  return (
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
};
