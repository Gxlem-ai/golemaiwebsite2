/** Joins class names, dropping anything falsy. */
export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

/** The site's one easing curve: quick to leave, slow to settle. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Header height in pixels; anchored scrolls stop this far short of the target. */
export const HEADER_OFFSET = 88;
