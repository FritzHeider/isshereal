/**
 * Motion tokens for motion/react, mirroring design/tokens.css so JS-driven
 * transitions use the same vocabulary as CSS. Keep in sync with tokens.css.
 */
export const EASE = {
  enter: [0.16, 1, 0.3, 1] as const, // --ease-enter
  switch: [0.2, 0, 0, 1] as const, // --ease-switch
  exit: [0.5, 0, 0.75, 0] as const, // --ease-exit
  lift: [0.33, 0, 0.15, 1] as const, // --ease-lift
};

export const DUR = {
  fast: 0.16, // --dur-fast
  base: 0.22, // --dur-base
  enter: 0.76, // --dur-enter
};
