/**
 * ErrorDisplay Component
 * User-friendly error display with retry functionality
 */

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  darkMode: boolean;
}

export function ErrorDisplay({ message, onRetry, darkMode }: ErrorDisplayProps): JSX.Element {
  return (
    <div
      className={`
        max-w-md mx-auto my-8 sm:my-12 p-6 sm:p-8 rounded-lg shadow-lg text-center
        ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-red-200'}
      `}
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <div className="flex justify-center mb-4">
        <svg
          className="w-12 h-12 sm:w-16 sm:h-16 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2
        className={`text-xl sm:text-2xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Oops! Something went wrong
      </h2>

      <p
        className={`mb-6 text-sm sm:text-base ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        {message}
      </p>

      <button
        onClick={onRetry}
        className={`
          px-6 py-3 rounded-lg font-semibold
          transition-colors duration-200
          focus:outline-none focus:ring-4
          ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50'
              : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300'
          }
        `}
        aria-label="Retry loading products"
      >
        Try Again
      </button>
    </div>
  );
}

