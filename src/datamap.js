import Map, { Source, Layer, NavigationControl } from "react-map-gl";
import React, { useRef, useEffect, useState } from "react";
import ControlPanel from "./control-panel";
import {
  ltnFillDataLayer,
  ltnOutlineDataLayer,
  boroughFillDataLayer,
  boroughOutlineDataLayer,
  pm25Layer,
  no2Layer,
} from "./mapStyle";
import GeocoderControl from "./geocoder-control";
import LtnPopup from "./ltn-popup";
import NodePopup from "./node-popup";
import { Loader } from "rsuite";
import axios from "axios";

import subMonths from "date-fns/subMonths";
import set from "date-fns/set";
import "./datamap.css";

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

function DataMap({ onNodeSelected, sites }) {
  const mapRef = useRef();

  const endDate = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const startDate = subMonths(endDate, 1);

  const [data, setData] = useState({
    siteData: nullGeoJson,
    ltnData: nullGeoJson,
    boroughData: nullGeoJson,
  });

  // Thanks https://stackoverflow.com/a/44185591

  useEffect(() => {
    const loadData = async () => {
      try {
        if (sites === undefined) {
          return;
        }

        console.log("Fetching datamap data from server");

        // Load all the data asynchronously and wait for the result
        const [siteAveragePM25, siteAverageNO2, ltnData, boroughData] =
          await Promise.all([
            axios.get(
              `${serverUrl}/site_average/pm25/${startDate.toISOString()}/${endDate.toISOString()}`
            ),
            axios.get(
              `${serverUrl}/site_average/no2/${startDate.toISOString()}/${endDate.toISOString()}`
            ),
            axios.get(`${serverUrl}/geometry/ltns`),
            axios.get(`${serverUrl}/geometry/boroughs`),
          ]);

        // Generate site geojson, enriched with pm25 and no2 averages
        const siteData = getSiteGeoJson(
          sites,
          siteAveragePM25.data,
          siteAverageNO2.data
        );

        setData({
          siteData: siteData,
          ltnData: ltnData.data,
          boroughData: boroughData.data,
        });
      } catch (error) {
        console.error("Error fetching datamap data:", error);
      }
    };

    loadData();
  }, [sites]);

  const adjustCoordinates = (event, coordinates) => {
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    return coordinates;
  };

  const getLtnCoordinates = (event) => {
    const centre = JSON.parse(event.features[0].properties.centre);
    const coordinates = adjustCoordinates(event, centre.coordinates.slice());
    return coordinates;
  };

  const getNodeLayerCoordinates = (event) => {
    return adjustCoordinates(
      event,
      event.features[0].geometry.coordinates.slice()
    );
  };

  const [features, setFeatures] = useState([]);
  const [forwardGeocoderFunc, setForwardGeocoderFunc] = useState(undefined);

  const [series, setSeries] = useState("pm25");
  const [hoverInfo, setHoverInfo] = useState(null);

  const featureData = [
    { label: "LTNs", value: "ltn" },
    { label: "Boroughs", value: "borough" },
  ];
  const onFeaturesChange = (features) => {
    console.log("Features: ", features);
    setFeatures(features);
  };
  const interactiveLayerIds = ["ltn_areas_fill", "no2Layer", "pm25Layer"];

  // If the mouse leaves the canvas, remove the popover
  const onMouseOut = (event) => {
    setHoverInfo(null);
  };

  const onMouseMove = (event) => {
    if (event.features.length === 0) {
      setHoverInfo(null);
      return;
    }

    let coordinates = null;

    switch (event.features[0].layer.id) {
      case "ltn_areas_fill":
        coordinates = getLtnCoordinates(event);
        break;

      case "no2Layer":
        coordinates = getNodeLayerCoordinates(event);
        break;
      case "pm25Layer":
        coordinates = getNodeLayerCoordinates(event);
        break;
      default:
        break;
    }

    if (coordinates) {
      setHoverInfo({
        properties: event.features[0].properties,
        longitude: coordinates[0],
        latitude: coordinates[1],
        layerId: event?.features[0].layer.id,
      });
    }
  };

  const onClick = (event) => {
    if (event.features.length === 0) {
      return;
    }

    switch (event.features[0].layer.id) {
      case "no2Layer":
      case "pm25Layer":
        onNodeSelected(event.features[0].properties);
        break;
      default:
        break;
    }
  };

  const updateSeries = (value) => {
    console.log("Setting series to ", value);
    setSeries(value);
  };

  const onGeocoderResultSelected = (evt) => {
    // If the result is an LTN, then make sure the LTN feature is selected
    if (evt.result.place_type.includes("ltn")) {
      if (!features.includes("ltn")) {
        setFeatures([...features, "ltn"]);
      }
    }
  };

  useEffect(() => {
    const forwardGeocoder = (query) => {
      if (query === undefined || query.length === 0) {
        return [];
      }
      var matchingFeatures = [];

      // Find matching nodes
      data.siteData.features.forEach((feature) => {
        // Handle queries with different capitalization
        // than the source data by calling toLowerCase().
        if (
          feature.properties.name.toLowerCase().includes(query.toLowerCase())
        ) {
          // Add a tree emoji as a prefix for custom
          // data results using carmen geojson format:
          // https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
          feature["place_name"] = `📡 ${feature.properties.name}`;
          feature["center"] = feature.geometry.coordinates;
          feature["place_type"] = ["node"];
          matchingFeatures.push(feature);
        }
      });

      // Find matching LTNs
      data.ltnData.features.forEach((feature) => {
        // Handle queries with different capitalization
        // than the source data by calling toLowerCase().
        if (
          feature.properties.Name.toLowerCase().includes(query.toLowerCase())
        ) {
          feature["place_name"] = `🚧 ${feature.properties.Name}`;
          feature["center"] = feature.properties.centre.coordinates;
          feature["place_type"] = ["ltn"];
          matchingFeatures.push(feature);
        }
      });

      return matchingFeatures;
    };

    // Only set the forwardGeocoderFunc once we have data, as we can only set this once
    // on the Geocoder component
    if (data.siteData.features.length > 0) {
      setForwardGeocoderFunc(() => forwardGeocoder);
    }
  }, [data.siteData, data.ltnData]);

  return (
    <div className="datamap">
      <Map
        mapLib={import("mapbox-gl")}
        ref={mapRef}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onClick={onClick}
        onRender={(event) => event.target.resize()}
        interactiveLayerIds={interactiveLayerIds}
        initialViewState={{
          latitude: 51.5099903,
          longitude: -0.1304413,
          zoom: 10,
        }}
        style={{ borderRadius: "2px" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {forwardGeocoderFunc && (
          <GeocoderControl
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            localGeocoder={forwardGeocoderFunc}
            position="bottom-right"
            onResult={onGeocoderResultSelected}
            placeholder="Find nodes or LTNs"
            proximity={{
              longitude: -0.1245982,
              latitude: 51.50876,
            }}
          />
        )}
        {/* Only create the NavigationControl once forwardGeocoderFunc has been
        set, otherwise the order on the page will be wrong */}
        {forwardGeocoderFunc && <NavigationControl position="bottom-right" />}
        <Source type="geojson" data={data.ltnData} generateId={true}>
          <Layer
            {...ltnFillDataLayer}
            layout={{
              visibility: features.includes("ltn") ? "visible" : "none",
            }}
          />
          <Layer
            {...ltnOutlineDataLayer}
            layout={{
              visibility: features.includes("ltn") ? "visible" : "none",
            }}
          />
        </Source>
        <Source type="geojson" data={data.boroughData} generateId={true}>
          <Layer
            {...boroughFillDataLayer}
            layout={{
              visibility: features.includes("borough") ? "visible" : "none",
            }}
          />
          <Layer
            {...boroughOutlineDataLayer}
            layout={{
              visibility: features.includes("borough") ? "visible" : "none",
            }}
          />
        </Source>
        {hoverInfo?.layerId === "ltn_areas_fill" && (
          <LtnPopup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            properties={hoverInfo.properties}
          />
        )}
        {(hoverInfo?.layerId === "no2Layer" ||
          hoverInfo?.layerId === "pm25Layer") && (
          <NodePopup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            properties={hoverInfo.properties}
          />
        )}
        <Source
          id="nodes"
          type="geojson"
          data={data.siteData}
          generateId={true}
        >
          <Layer
            {...pm25Layer}
            layout={{ visibility: series === "pm25" ? "visible" : "none" }}
          />
          <Layer
            {...no2Layer}
            layout={{ visibility: series === "no2" ? "visible" : "none" }}
          />
        </Source>
        <ControlPanel
          featureData={featureData}
          onFeaturesChange={onFeaturesChange}
          onSeriesChange={updateSeries}
          seriesValue={series}
          featureValue={features}
        />
      </Map>
      {data.siteData.features.length === 0 && <Loader size="lg" center />}
    </div>
  );
}

export default DataMap;
