interface LoadingProps {
  /** Size of the spinner in pixels */
  size?: number;
  /** Accessible label for screen readers */
  label?: string;
  /** Show full-page centered overlay */
  fullPage?: boolean;
}

export default function Loading({
  size = 32,
  label = 'Loading…',
  fullPage = false,
}: LoadingProps) {
  const spinner = (
    <span role="status" aria-label={label} className="inline-flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-spin text-blue-600"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
