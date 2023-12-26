import * as React from "react";
import { Popup } from "react-map-gl";

function WrappedNodePopup({ longitude, latitude, details }) {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      offset={[0, 0]}
      closeButton={false}
      className="hover-info"
    >
      <div className="site-info">
        <strong>{details.name}</strong>
        Click to view Air Aware Wrapped!
      </div>
    </Popup>
  );
}

export default React.memo(WrappedNodePopup);
