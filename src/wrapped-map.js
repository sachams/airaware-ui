import Map, { Source, Layer, NavigationControl } from "react-map-gl";
import React, { useRef } from "react";
import { wrappedNodesLayer } from "./mapStyle";
import GeocoderControl from "./geocoder-control";

function WrappedMap({ data, onSelect }) {
  const mapRef = useRef();

  const getSiteGeoJson = (data) => {
    // Generate the site GeoJSON, spreading the node data as a property
    const features = data.map((site) => ({
      type: "Feature",
      properties: {
        ...site,
        site_code: site.details.site_code,
        enabled_status: site.details.is_enabled ? "Enabled" : "Disabled",
      },
      geometry: {
        type: "Point",
        coordinates: [site.details.longitude, site.details.latitude],
      },
    }));
    const featureCollection = { type: "FeatureCollection", features: features };

    return featureCollection;
  };

  const siteGeoJson = getSiteGeoJson(data);

  const onClick = (event) => {
    if (event.features.length === 0) {
      return;
    }

    onSelect(event.features[0]);
  };

  const forwardGeocoder = (query) => {
    if (query === undefined || query.length === 0) {
      return [];
    }
    var matchingFeatures = [];

    // Find matching nodes
    siteGeoJson.features.forEach((feature) => {
      // Handle queries with different capitalization
      // than the source data by calling toLowerCase().
      if (
        feature.properties.details.name
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        // Add a tree emoji as a prefix for custom
        // data results using carmen geojson format:
        // https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
        feature["place_name"] = `📡 ${feature.properties.details.name}`;
        feature["center"] = feature.geometry.coordinates;
        feature["place_type"] = ["node"];
        matchingFeatures.push(feature);
      }
    });

    return matchingFeatures;
  };

  return (
    <>
      <Map
        mapLib={import("mapbox-gl")}
        ref={mapRef}
        onClick={onClick}
        interactiveLayerIds={["wrappedNodesLayer"]}
        initialViewState={{
          latitude: 51.5099903,
          longitude: -0.1304413,
          zoom: 10,
        }}
        style={{ height: "100vh", width: "100vw" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <NavigationControl position="bottom-right" />
        <GeocoderControl
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          localGeocoder={forwardGeocoder}
          position="top-right"
          placeholder="Find a node near you"
          proximity={{
            longitude: -0.1245982,
            latitude: 51.50876,
          }}
        />
        <Source id="nodes" type="geojson" data={siteGeoJson} generateId={true}>
          <Layer {...wrappedNodesLayer} />
        </Source>
      </Map>
    </>
  );
}

export default WrappedMap;
