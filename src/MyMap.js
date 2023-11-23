import Map, {
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import React, { useRef, useEffect, useState } from "react";
import {
  ltnFillDataLayer,
  ltnOutlineDataLayer,
  pm25Layer,
  no2Layer,
} from "./mapStyle";
import GeocoderControl from "./geocoder-control";

function MyMap({ siteData, ltnData, boroughData }) {
  const forwardGeocoder = (query) => {
    console.log("Entered forwardGeocoder");

    var matchingFeatures = [];

    console.log("Query is ", query);
    console.log("siteData is ", siteData);
    console.log("ltnData is ", ltnData);

    // Find matching nodes
    siteData.features.forEach((feature) => {
      // Handle queries with different capitalization
      // than the source data by calling toLowerCase().
      if (
        feature.properties.site_name.toLowerCase().includes(query.toLowerCase())
      ) {
        // Add a tree emoji as a prefix for custom
        // data results using carmen geojson format:
        // https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
        feature["place_name"] = `📍 ${feature.properties.site_name}`;
        feature["center"] = feature.geometry.coordinates;
        feature["place_type"] = ["poi"];
        matchingFeatures.push(feature);
      }
    });

    // Find matching LTNs
    ltnData.features.forEach((feature) => {
      // Handle queries with different capitalization
      // than the source data by calling toLowerCase().
      if (feature.properties.Name.toLowerCase().includes(query.toLowerCase())) {
        feature["place_name"] = `🚧 ${feature.properties.Name}`;
        feature["center"] = feature.properties.centre.coordinates;
        feature["place_type"] = ["poi"];
        matchingFeatures.push(feature);
      }
    });

    return matchingFeatures;
  };

  return (
    <>
      <Map
        mapLib={import("mapbox-gl")}
        initialViewState={{
          latitude: 51.5099903,
          longitude: -0.1304413,
          zoom: 10,
        }}
        style={{ height: 600 }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
        <GeocoderControl
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          position="bottom-right"
          proximity={{
            longitude: -0.1245982,
            latitude: 51.50876,
          }}
          localGeocoder={forwardGeocoder}
        />
        <Source type="geojson" data={ltnData}>
          <Layer {...ltnFillDataLayer} />
          <Layer {...ltnOutlineDataLayer} />
        </Source>
        <Source type="geojson" data={siteData}>
          {/* <Layer {...pm25Layer} /> */}
          <Layer {...no2Layer} />
        </Source>
      </Map>
    </>
  );
}

export default MyMap;
