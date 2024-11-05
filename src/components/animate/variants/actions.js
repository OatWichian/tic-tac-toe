// ----------------------------------------------------------------------

export const varHover = (hover = 1.09, tap = 0.97) => ({
  hover: { scale: hover },
  tap: { scale: tap },
});

export const varSmallClick = {
  hover: { scale: 1.04 },
  tap: { scale: 0.96 },
};

export const varMediumClick = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};
