export const parseToMs = (time: any) => {
  const value = parseInt(time.slice(0, -1), 10);
  const unit = time.slice(-1);

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "m":
      return value * 60 * 1000;
    case "s":
      return value * 1000;
    default:
      throw new Error("Invalid expiry format");
  }
};
