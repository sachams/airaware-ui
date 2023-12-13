export const getSeriesName = (series) => {
  const seriesMap = { pm25: "PM2.5", no2: "NO2" };

  return seriesMap[series];
};
