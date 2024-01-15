import { format } from "date-fns";

export const getSeriesName = (series) => {
  const seriesMap = { pm25: "PM2.5", no2: "NO2" };

  return seriesMap[series];
};

export const getSeriesDescription = (series) => {
  const seriesMap = { pm25: "particulate matter", no2: "nitrogen dioxide" };

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
      link: "https://www.c40knowledgehub.org/s/article/WHO-Air-Quality-Guidelines?language=en_US",
      value: 5,
    },
    uk: {
      description: "UK annual limit",
      link: "https://www.gov.uk/government/statistics/air-quality-statistics/concentrations-of-particulate-matter-pm10-and-pm25",
      value: 20,
    },
  },
  no2: {
    who: {
      description: "WHO annual guideline",
      link: "https://www.c40knowledgehub.org/s/article/WHO-Air-Quality-Guidelines?language=en_US",
      value: 10,
    },
    uk: {
      description: "UK annual limit",
      link: "https://www.gov.uk/government/statistics/air-quality-statistics/ntrogen-dioxide",
      value: 40,
    },
  },
};

export const formatMonthYear = (d) => {
  return format(d, "MMM yy");
};

export const nullGeoJson = {
  type: "FeatureCollection",
  features: [],
};
