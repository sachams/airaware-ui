import "./App.css";
import MyMap from "./MyMap";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DateTime } from "luxon";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const nullGeoJson = {
  type: "FeatureCollection",
  features: [],
};

function getSiteGeoJson(sites, siteAveragePM25, siteAverageNO2) {
  // Generate a map of pm25 averages from a list of dicts
  const siteAveragePM25Map = siteAveragePM25.reduce(
    (map, obj) => ((map[obj.site_code] = obj.value), map),
    {}
  );

  // Generate a map of no2 averages from a list of dicts
  const siteAverageNO2MMap = siteAverageNO2.reduce(
    (map, obj) => ((map[obj.site_code] = obj.value), map),
    {}
  );

  // Generate the site GeoJSON, spreading the node data as a property
  const features = sites.map((site) => ({
    type: "Feature",
    properties: {
      ...site,
      enabled_status: site.is_enabled ? "Enabled" : "Disabled",
      AveragePM25: siteAveragePM25Map[site.site_code],
      AverageNO2: siteAverageNO2MMap[site.site_code],
    },
    geometry: {
      type: "Point",
      coordinates: [site.longitude, site.latitude],
    },
  }));
  const featureCollection = { type: "FeatureCollection", features: features };

  return featureCollection;
}

function App() {
  const [startDate, setStartDate] = useState(
    DateTime.now().minus({ months: 1 })
  );
  const [endDate, setEndDate] = useState(DateTime.now());

  const noop = () => {};

  const [data, setData] = useState({
    siteData: nullGeoJson,
    ltnData: nullGeoJson,
    boroughData: nullGeoJson,
  });

  // Thanks https://stackoverflow.com/a/44185591

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching data from server");

        // Load all the data asynchronously and wait for the result
        const [sites, siteAveragePM25, siteAverageNO2, ltnData, boroughData] =
          await Promise.all([
            axios.get(`${serverUrl}/sites`),
            axios.get(
              `${serverUrl}/site_average/pm25/${startDate.toString()}/${endDate.toString()}`
            ),
            axios.get(
              `${serverUrl}/site_average/no2/${startDate.toString()}/${endDate.toString()}`
            ),
            axios.get(`${serverUrl}/geometry/ltns`),
            axios.get(`${serverUrl}/geometry/boroughs`),
          ]);

        // Generate site geojson, enriched with pm25 and no2 averages
        const siteData = getSiteGeoJson(
          sites.data,
          siteAveragePM25.data,
          siteAverageNO2.data
        );

        setData({
          siteData: siteData,
          ltnData: ltnData.data,
          boroughData: boroughData.data,
        });
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <MyMap
        siteData={data.siteData}
        ltnData={data.ltnData}
        boroughData={data.boroughData}
      />
    </>
  );
}

export default App;
