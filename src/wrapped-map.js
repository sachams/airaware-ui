import Map, { Source, Layer, NavigationControl } from "react-map-gl";
import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { wrappedNodesLayer } from "./mapStyle";
import GeocoderControl from "./geocoder-control";
import WrappedNodePopup from "./wrapped-node-popup";

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

  const adjustCoordinates = (event, coordinates) => {
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    return coordinates;
  };

  const [forwardGeocoderFunc, setForwardGeocoderFunc] = useState(undefined);
  const [hoverInfo, setHoverInfo] = useState(null);

  // If the mouse leaves the canvas, remove the popover
  const onMouseOut = useCallback((event) => {
    setHoverInfo(null);
  });

  const onMouseMove = useCallback((event) => {
    if (event.features.length === 0) {
      setHoverInfo(null);
      return;
    }

    const coordinates = adjustCoordinates(
      event,
      event.features[0].geometry.coordinates.slice()
    );

    setHoverInfo({
      details: event.features[0].properties.details,
      longitude: coordinates[0],
      latitude: coordinates[1],
      layerId: event?.features[0].layer.id,
    });
  });

  const onClick = useCallback((event) => {
    if (event.features.length === 0) {
      return;
    }

    onSelect(event.features[0]);
  });

  const forwardGeocoder = (query) => {
    if (query === undefined || query.length == 0) {
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
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
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
