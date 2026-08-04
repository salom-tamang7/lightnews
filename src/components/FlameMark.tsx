export function FlameMark({
  className = "",
  live = false,
}: {
  className?: string;
  live?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} ${live ? "flame-live" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 7 7.5 7 12.5C7 16 9.2 18.5 12 18.5C14.8 18.5 17 16 17 12.5C17 10.7 16 9 15 7.8C15 9.2 14.2 10 13.4 10C14 8 13.5 5 12 2Z"
        fill="var(--ln-gold)"
      />
      <path
        d="M12 10C12 10 10.3 12.2 10.3 14.2C10.3 15.6 11 16.8 12 16.8C13 16.8 13.7 15.6 13.7 14.2C13.7 12.9 13 11.8 12.5 11.1C12.5 11.8 12.2 12.1 11.9 12.1C11.6 11 11.7 10.5 12 10Z"
        fill="var(--ln-bg)"
        opacity="0.55"
      />
    </svg>
  );
}
