// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/

export const primaryNodeColour = "#ed936b";
export const comparisonNodeColour = "#7dc0a7";

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

export const wrappedNodesLayer = {
  id: "wrappedNodesLayer",
  layout: {
    visibility: "visible",
  },
  type: "circle",
  paint: {
    "circle-color": "#ff0000",
    "circle-radius": 9,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#7f7f7f",
    "circle-opacity": 0.8,
  },
};

export const pm25Layer = {
  id: "pm25Layer",
  type: "circle",
  paint: {
    "circle-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      primaryNodeColour,
      [
        "match",
        ["get", "enabled_status"],
        "Enabled",
        "#69bdc7",
        /* other */ "#aaa",
      ],
    ],

    "circle-radius": [
      "match",
      ["get", "enabled_status"],
      "Enabled",
      ["get", "AveragePM25"],
      /* other */ 9,
    ],
    "circle-stroke-width": 1,
    "circle-stroke-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      primaryNodeColour,
      "#ffffff",
    ],
    "circle-opacity": [
      "match",
      ["get", "enabled_status"],
      "Enabled",
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
      "case",
      ["boolean", ["feature-state", "selected"], false],
      primaryNodeColour,
      [
        "match",
        ["get", "enabled_status"],
        "Enabled",
        "#b88c49",
        /* other */ "#aaa",
      ],
    ],

    "circle-radius": [
      "match",
      ["get", "enabled_status"],
      "Enabled",
      ["*", ["get", "AverageNO2"], 0.4],
      /* other */ 9,
    ],
    "circle-stroke-width": 1,
    "circle-stroke-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      primaryNodeColour,
      "#ffffff",
    ],
    "circle-opacity": [
      "match",
      ["get", "enabled_status"],
      "Enabled",
      0.75,
      /* other  */ 0.6,
    ],
  },
};
