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

export const thresholds = {
  pm25: {
    who: {
      description: "WHO annual guideline",
      value: 25,
    },
    mayor: {
      description: "Mayor of London's limit",
      value: 35,
    },
    uk: {
      description: "UK annual limit",
      value: 45,
    },
  },
  no2: {
    who: {
      description: "WHO annual guideline",
      value: 22,
    },
    mayor: {
      description: "Mayor of London's limit",
      value: 32,
    },
    uk: {
      description: "UK annual limit",
      value: 42,
    },
  },
};
