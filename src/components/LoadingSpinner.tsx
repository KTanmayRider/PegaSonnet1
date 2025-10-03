/**
 * LoadingSpinner Component
 * Accessible loading indicator with animation
 */

interface LoadingSpinnerProps {
  darkMode: boolean;
}

export function LoadingSpinner({ darkMode }: LoadingSpinnerProps): JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 sm:py-20"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        <div
          className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${
            darkMode ? 'border-blue-500' : 'border-blue-600'
          }`}
          aria-hidden="true"
        />
      </div>
      <p
        className={`mt-4 text-base sm:text-lg font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        Loading products...
      </p>
      <span className="sr-only">Loading products, please wait</span>
    </div>
  );
}

