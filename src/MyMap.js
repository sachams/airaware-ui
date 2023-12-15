import Map, {
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Popup,
} from "react-map-gl";
import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import ControlPanel from "./control-panel";
import {
  ltnFillDataLayer,
  ltnOutlineDataLayer,
  boroughFillDataLayer,
  boroughOutlineDataLayer,
  pm25Layer,
  no2Layer,
  selectedNodeLayer,
} from "./mapStyle";
import GeocoderControl from "./geocoder-control";
import LtnPopup from "./ltn-popup";
import NodePopup from "./node-popup";
import SidePanel from "./side-panel";
import AboutDrawer from "./about-drawer";
import { Loader } from "rsuite";

function MyMap({ siteData, ltnData, boroughData }) {
  const mapRef = useRef();

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
  const [aboutDrawerOpen, setAboutDrawerOpen] = useState(false);

  const [series, setSeries] = useState("pm25");
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const selectedSiteCode = selectedFeature
    ? selectedFeature.properties.site_code
    : "";
  const selectedNodeFilter = useMemo(
    () => ["in", "site_code", selectedSiteCode],
    [selectedSiteCode]
  );

  const featureData = [
    { label: "LTNs", value: "ltn" },
    { label: "Boroughs", value: "borough" },
  ];
  const onFeaturesChange = (features) => {
    console.log("Features: ", features);
    setFeatures(features);
  };
  const interactiveLayerIds = ["ltn_areas_fill", "no2Layer", "pm25Layer"];

  const onLogoClick = () => {
    setAboutDrawerOpen(true);
  };

  // If the mouse leaves the canvas, remove the popover
  const onMouseOut = useCallback((event) => {
    setHoverInfo(null);
  });

  const onMouseMove = useCallback((event) => {
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
    }

    if (coordinates) {
      setHoverInfo({
        properties: event.features[0].properties,
        longitude: coordinates[0],
        latitude: coordinates[1],
        layerId: event?.features[0].layer.id,
      });
    }
  });

  const setFeatureState = (selectedFeature, isSelected) => {
    if (selectedFeature) {
      mapRef.current.setFeatureState(
        { source: "nodes", id: selectedFeature.id },
        { selected: isSelected }
      );
    }
  };
  const onSidePanelClose = useCallback(() => {
    setFeatureState(selectedFeature, false);
    setSelectedFeature(null);
  });

  const onClick = useCallback((event) => {
    if (event.features.length === 0) {
      setFeatureState(selectedFeature, false);
      setSelectedFeature(null);
      return;
    }

    switch (event.features[0].layer.id) {
      case "no2Layer":
      case "pm25Layer":
        // If the node is the one that is selected, unselect it
        if (selectedFeature?.id === event.features[0].id) {
          setFeatureState(selectedFeature, false);
          setSelectedFeature(null);
        } else {
          setFeatureState(selectedFeature, false);
          setFeatureState(event.features[0], true);
          setSelectedFeature(event.features[0]);
        }
        break;

      default:
        setFeatureState(selectedFeature, false);
        setSelectedFeature(null);
        break;
    }
  });

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
      if (query === undefined || query.length == 0) {
        return [];
      }
      var matchingFeatures = [];

      // Find matching nodes
      siteData.features.forEach((feature) => {
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
      ltnData.features.forEach((feature) => {
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
    if (siteData.features.length > 0) {
      setForwardGeocoderFunc(() => forwardGeocoder);
    }
  }, [siteData, ltnData]);

  return (
    <>
      <Map
        mapLib={import("mapbox-gl")}
        ref={mapRef}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onClick={onClick}
        interactiveLayerIds={interactiveLayerIds}
        initialViewState={{
          latitude: 51.5099903,
          longitude: -0.1304413,
          zoom: 10,
        }}
        style={{ height: "100vh", width: "100vw" }}
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
        /* Only create the NavigationControl once forwardGeocoderFunc has been
        set, otherwise the order on the page will be wrong */
        {forwardGeocoderFunc && <NavigationControl position="bottom-right" />}
        <Source type="geojson" data={ltnData} generateId={true}>
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
        <Source type="geojson" data={boroughData} generateId={true}>
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
        <Source id="nodes" type="geojson" data={siteData} generateId={true}>
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
        <SidePanel
          siteData={siteData}
          onClose={onSidePanelClose}
          selectedNode={selectedFeature?.properties}
        />
        <AboutDrawer
          isOpen={aboutDrawerOpen}
          setAboutDrawerOpen={setAboutDrawerOpen}
        />
        <img
          src="/logo-small-transparent.png"
          className="logo"
          onClick={() => setAboutDrawerOpen(true)}
        />
      </Map>
      {siteData.features.length == 0 && <Loader size="lg" center />}
    </>
  );
}

export default MyMap;
