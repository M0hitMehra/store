import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const server = "https://store-backend-0jpc.onrender.com/api/v1";
// export const server = "http://localhost:8080/api/v1";

export function TypographyH1({ children, className }) {
  return (
    <h1
      className={clsx(
        "scroll-m-20 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight lg:text-6xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }) {
  return (
    <h2
      className={clsx(
        "scroll-m-20 border-b pb-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }) {
  return (
    <h3
      className={clsx(
        "scroll-m-20 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className }) {
  return (
    <h4
      className={clsx(
        "scroll-m-20 text-lg sm:text-xl md:text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyP({ children, className }) {
  return (
    <p
      className={clsx(
        "leading-7 text-base sm:text-lg md:text-xl [&:not(:first-child)]:mt-6",
        className
      )}
    >
      {children}
    </p>
  );
}

export function TypographyBlockquote({ children, className }) {
  return (
    <blockquote
      className={clsx(
        "mt-6 border-l-2 pl-4 sm:pl-6 md:pl-8 italic text-sm sm:text-base md:text-lg",
        className
      )}
    >
      {children}
    </blockquote>
  );
}

export const invertColor = (hex) => {
  // Remove the leading '#' if present
  hex = hex?.replace("#", "");

  // Convert hex to RGB
  let r = parseInt(hex?.substring(0, 2), 16);
  let g = parseInt(hex?.substring(2, 4), 16);
  let b = parseInt(hex?.substring(4, 6), 16);

  // Invert each channel
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;

  // Convert RGB back to hex
  const invertedHex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;

  return invertedHex;
};
