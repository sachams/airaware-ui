import * as React from "react";
import { Popup } from "react-map-gl";

function NodePopup({ longitude, latitude, properties }) {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      offset={[0, 0]}
      closeButton={false}
      className="hover-info"
    >
      {properties.name}
    </Popup>
  );
}

export default React.memo(NodePopup);
