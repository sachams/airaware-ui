// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/

export const ltnFillDataLayer = {
  id: "ltn_areas_fill",
  type: "fill",
  source: "ltn_areas", // reference the data source
  layout: {},
  paint: {
    "fill-color": "#0080ff", // blue color fill
    "fill-opacity": 0.5,
  },
};

export const ltnOutlineDataLayer = {
  id: "ltn_areas_outline",
  type: "line",
  source: "ltn_areas",
  layout: {},
  paint: {
    "line-color": "#777",
    "line-width": 1,
  },
};

export const boroughFillDataLayer = {
  id: "boroughs_fill",
  type: "fill",
  source: "boroughs", // reference the data source
  layout: {},
  paint: {
    "fill-color": "#E32636", // red color fill
    "fill-opacity": 0.3,
  },
};

export const boroughOutlineDataLayer = {
  id: "boroughs_outline",
  type: "line",
  source: "boroughs",
  layout: {},
  paint: {
    "line-color": "#777",
    "line-width": 1,
  },
};

export const pm25Layer = {
  id: "pm25Layer",
  type: "circle",
  paint: {
    "circle-color": [
      "match",
      ["get", "status"],
      "healthy",
      "#69bdc7",
      /* other */ "#aaa",
    ],

    "circle-radius": [
      "match",
      ["get", "status"],
      "healthy",
      ["get", "AveragePM25"],
      /* other */ 9,
    ],
    "circle-stroke-width": 1,
    "circle-stroke-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      "#ff0000",
      "#ffffff",
    ],
    "circle-opacity": [
      "match",
      ["get", "status"],
      "healthy",
      0.75,
      /* other  */ 0.6,
    ],
  },
};

export const no2Layer = {
  id: "no2Layer",
  type: "circle",
  paint: {
    "circle-color": [
      "match",
      ["get", "status"],
      "healthy",
      "#b88c49",
      /* other */ "#aaa",
    ],

    "circle-radius": [
      "match",
      ["get", "status"],
      "healthy",
      ["*", ["get", "AverageNO2"], 0.4],
      /* other */ 9,
    ],
    "circle-stroke-width": 1,
    "circle-stroke-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      "#ff0000",
      "#ffffff",
    ],
    "circle-opacity": [
      "match",
      ["get", "status"],
      "healthy",
      0.75,
      /* other  */ 0.6,
    ],
  },
};
