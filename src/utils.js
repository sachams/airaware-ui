export const getSeriesName = (series) => {
  const seriesMap = { pm25: "PM2.5", no2: "NO2" };

  return seriesMap[series];
};

export const nthNumber = (number) => {
  if (number > 3 && number < 21) return "th";
  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
